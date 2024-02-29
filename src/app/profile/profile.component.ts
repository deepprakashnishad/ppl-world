import { 
  Component, 
  OnInit, 
  ViewChild
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router, RoutesRecognized} from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ProfileService } from './profile.service';
import { GeneralService } from './../general.service';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { Person } from  './../person/person';
import { environment } from './../../environments/environment';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { map, mergeMap, startWith, mergeMapTo } from 'rxjs/operators';
import { ShareComponent } from './../shared/share/share.component';
import { PaymentComponent } from './../payment/payment.component';
import {PersonExactMatchComponent} from './../person/person-exact-match/person-exact-match.component';
import {GuideComponent} from './guide/guide.component';
import {
  MatBottomSheet
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

const maxLevel = 4;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  person: Person = new Person();
  keys: Array<string> = [];
  maxChildOrbit: number = 0;

  selectedPersonForApproval: any;

  transferCreditsTo: any;

  transferAmt: number;

  uploadPath: string = "";

  order: any;

  totalAmountForSlots: number = 2500;

  slotCount: number = 10;

  buyButtonDisabled: boolean = false;

  otpSent: boolean = false;

  np: any = {};

  @ViewChild('boughtForSearchBox') boughtFor: PersonExactMatchComponent;

  @ViewChild('beneficiary') beneficiary: PersonExactMatchComponent;
  @ViewChild('referrerCntl') referrerCntl: PersonExactMatchComponent;

  constructor(
    private profileService: ProfileService,
    private afMessaging: AngularFireMessaging,
    private router: Router,
    private generalService: GeneralService,
    private _bottomSheet: MatBottomSheet,
    private notifier: NotifierService,
    private authService: AuthenticationService,
    private translate: TranslateService,
    public dialog: MatDialog
  ){
  }

  ngOnInit(){

    this.totalAmountForSlots = this.slotCount*environment.slotPrice;

    this.profileService.getPersonDetail().subscribe(result=>{
      this.person = Person.fromJSON(result);

      this.uploadPath = `person/${this.person.id}`;
      
      this.keys = Object.keys(this.person.lwdlc);
      this.keys = this.keys.filter(ele=>Number(ele)<=maxLevel);
      for(var i=0;i < this.keys.length;i++){
        var currLevel = this.keys[i];
        var clKeys = Object.keys(this.person.lwdlc[currLevel]);
        if(clKeys.length > this.maxChildOrbit){
          this.maxChildOrbit = clKeys.length-1;
        }
      }

      if(!this.person.directDownlines || this.person.directDownlines.length<5){
        const dialogRef = this.dialog.open(GuideComponent, {
          data: {person: this.person},
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
        });
      }
    });
  }

  isAuthorizedToAddSale(){
    var isAuthorized = this.authService.authorizeUser(["ADD_SALE"]);
    return isAuthorized;
  }

  newPersonSelected(event){
    if(event.person){
      this.selectedPersonForApproval = event.person; 
    }
  }

  slotCountUpdated(event){
    if(this.slotCount > 11000){
      this.slotCount = 11000;
    }

    this.totalAmountForSlots = this.slotCount*environment.slotPrice;
  }

  validatePurchase(){
    if(this.slotCount <=0 ){
      this.notifier.notify("error", "Slot count should be greater than 0");
      return false;
    }
    if(this.totalAmountForSlots <=0 ){
      this.notifier.notify("error", "Amount should be greater than 0");
      return false;
    }

    if(!this.selectedPersonForApproval || !this.selectedPersonForApproval.id){
      this.notifier.notify("error", "Please select a person");
      return false;
    }
    return true;
  }

  approve(){
    if(!this.validatePurchase()){
      return;
    }
    if(this.person.amtWithdrawable < this.totalAmountForSlots){
      this.notifier.notify("error", `Insufficient balance. INR ${this.totalAmountForSlots - Math.round(this.person.amtWithdrawable)} more is required.`);
    }else{
      this.buyButtonDisabled = true;
      this.profileService.buySlots(
        this.selectedPersonForApproval.id, 
        this.totalAmountForSlots,
        this.slotCount
      ).subscribe(result=>{
        this.buyButtonDisabled = false;
        if(result['success']){
          this.selectedPersonForApproval = undefined;
          this.slotCount = 0;
          this.totalAmountForSlots = 0;
          this.boughtFor.reset();
          this.notifier.notify("success", "Slots retrieval successfull");
        }else{
          this.notifier.notify("error", "Failed to get slots");
          if(result['msg']){
            this.notifier.notify("error", result['msg']);
          }
        }
      }, err=>{
        console.log(err);
        this.buyButtonDisabled = false;
      });
    }
  }

  donate(){
    if(!this.validatePurchase()){
      return;
    }
    const bottomSheet = this._bottomSheet.open(PaymentComponent, {
      data: {
        displayDetails: {
          title: "Donation"
        },
        order: {
          title: `Digital Slots`,
          qty: this.slotCount,
          desc: `Donation for ${this.slotCount} slots for ${this.selectedPersonForApproval.n} with mob no. ${this.selectedPersonForApproval.m}`,
          prod: `Donation for ${this.slotCount} slots for ${this.selectedPersonForApproval.n} with mob no. ${this.selectedPersonForApproval.m}`,
          prodId: "UExpSlots",
          prodDesc: "",
          amount: this.totalAmountForSlots,
          action: "buySlots",
          isPersonRequired: true,
          extraInfo: {
            "buyerId": this.selectedPersonForApproval.id
          }
        },
        redirectUrl: "/profile",
        action_name: "Donate Now"
      }
    });
    bottomSheet.afterDismissed().subscribe(result=>{
      if(result && result.id){
        this.notifier.notify("success", "Donation successfull");
      }else{
        this.notifier.notify("error", "Some error occurred");
      }
    });
  }

  uploadCompleted(event, type){
    this.profileService.updateProfileImages(event, type).subscribe(result=>{
      if(result['success']){
        this.person[type] = event;
        this.notifier.notify("success", "Update successfull");
      }else{
        this.notifier.notify("error", "Update failed");
      }
    });
  }

  openShareBottomSheet(){
    if(!this.person.id){
      this.notifier.notify("error", "Try again in sometime.")
    }
    var mTxt = `${this.person.name} is inviting you to GoodAct platform. Join GoodAct to help people in time of need and to get help in your critical phase of life. This is also an oppurtunity to make your dreams true. So join by clicking on below link. ${window.location.protocol}//${environment.appUrl}/login?referrer=${encodeURIComponent(this.person.mobile)}`;
    var mLink = `${environment.appUrl}//${window.location.host}/login?referrer=${encodeURIComponent(this.person.mobile)}`;
    this._bottomSheet.open(ShareComponent, {data: {"mTxt": mTxt, "mLink": mLink}});
  }

  personSelected($event, selectionType){
    if(selectionType === "CREDIT_TRANSFER"){
      this.transferCreditsTo = $event.person; 
      if(this.transferCreditsTo.id === this.person.id){
        this.notifier.notify("error", "Cannot transfer funds to self");
        this.beneficiary.reset();
      }  
    }else if(selectionType === "SLOT_PURCHASE"){
      this.selectedPersonForApproval = $event.person;
    }else if(selectionType === "REFERRER"){
      this.np.parent = $event.person;
    }
  }

  transfer(){
    if(this.transferAmt<0){
      this.notifier.notify("error", "Amount should be greater than 0.");
      return;
    }
    if(!this.transferCreditsTo || !this.transferAmt){
      this.notifier.notify("error", "Select a person and enter amount to be transferred");
      return;
    }

    this.profileService.tranferCredits(this.transferCreditsTo, Number(this.transferAmt))
    .subscribe(result=>{
      if(result.success){
        this.beneficiary.reset();
        this.transferAmt = 0;
        this.notifier.notify("success", "Amount successfully credited");
      }else{
        this.notifier.notify("error", "Failed to transfer credit");
      }
    });
  }

  requestNotification() {
    this.afMessaging.requestPermission
      .pipe(mergeMapTo(this.afMessaging.tokenChanges))
      .subscribe(
        (token) => { 
          this.generalService.updateFirebaseMessagingToken(token).subscribe(result=>{
            console.log(result);
          });
          console.log('Permission granted! Save to the server!', token); 
        },
        (error) => { console.error(error); },  
      );
  }

  navigateTo(url){
    this.router.navigate([url]);
  }

  saveNewPerson(){
    if(!this.np.name || !this.np.mobile){
      this.notifier.notify("error", this.translate.instant("SIGNUP_FORM.NAME_MOB_MISS_PROMPT"));
      return;
    }
    if(this.np.mobile.length!==10){
      this.notifier.notify("error", this.translate.instant("VALID_MOBILE_PROMPT"));
      return; 
    }else{
      var mobile = "+91" + this.np.mobile;
    }
    if(!this.np.parent){
      return this.notifier.notify("error", this.translate.instant("REF_MISS_PROMPT"));
    }

    this.authService.createUserOnBehalf(
      {
        name: this.np.name, 
        password: undefined, 
        email: this.np.email, 
        mobile: mobile, 
        parent: this.np.parent,
        otp: this.np.otp
      }
    ).subscribe((authResponse) =>  {
      if (authResponse['success']) {
        this.notifier.notify("success", this.translate.instant('SIGNUP_FORM.CREATION_SUCCESS_MSG'));
        this.np = {};
        this.referrerCntl.reset();
      }else{
        this.notifier.notify("error", authResponse['msg']);
      }
    }, error => {
      this.notifier.notify("error", error.error.msg);
    });
  }

  generateOTP(){
    var mobile = "+91" + this.np.mobile;
    if(mobile.length != 13){
      this.notifier.notify("error", "Invalid mobile number");
      return;
    }
    this.authService.requestOTP(mobile).subscribe((result)=>{
      if(result.success){
        this.otpSent = true;

        this.notifier.notify("success", "OTP sent to mobile number provided");
      }else{
        this.notifier.notify("error", "Failed to send OTP message. Please try again later.");
      }
    });
  }
}