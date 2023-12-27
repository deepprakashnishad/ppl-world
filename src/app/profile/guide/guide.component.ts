import { 
  Component, 
  OnInit, 
  ViewChild, 
  Inject
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router, RoutesRecognized} from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { Person } from  './../../person/person';
import { environment } from './../../../environments/environment';
import { PaymentComponent } from './../../payment/payment.component';
import {PersonExactMatchComponent} from './../../person/person-exact-match/person-exact-match.component';
import { ShareComponent } from './../../shared/share/share.component';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-guide',
  templateUrl: 'guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit {

  person: Person;

  selectedPersonForApproval: any;

  order: any;

  totalAmountForSlots: number = 500;

  slotCount: number = 2;

  np: any = {};

  @ViewChild('boughtForSearchBox') boughtFor: PersonExactMatchComponent;

  activate: boolean = false;

  constructor(
    private notifier: NotifierService,
    private _bottomSheet: MatBottomSheet,
    public dialogRef: MatDialogRef<GuideComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){
    if(data.person){
      this.person = data.person;
    }
  }

  ngOnInit(){
    console.log(this.person.directDownlines.length);
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
          prod: `Donation for ${this.slotCount} slots for ${this.person.name} with mob no. ${this.person.mobile}`,
          prodId: "UExpSlots",
          prodDesc: "",
          amount: this.totalAmountForSlots,
          extraInfo: {"buyerId": this.person.id}
        },
        redirectUrl: "/profile",
        action_name: "Donate Now"
      }
    });
    bottomSheet.afterDismissed().subscribe(result=>{
      if(result.id){
        this.notifier.notify("success", "Donation successfull");
      }else{
        this.notifier.notify("error", "Some error occurred");
      }
    });
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

    if(!this.person || !this.person.id){
      this.notifier.notify("error", "Please select a person");
      return false;
    }
    return true;
  }

  slotCountUpdated(event){
    if(this.slotCount > 11000){
      this.slotCount = 11000;
    }

    this.totalAmountForSlots = this.slotCount*environment.slotPrice;
  }

  openShareBottomSheet(){
    if(!this.person.id){
      this.notifier.notify("error", "Try again in sometime.")
    }
    var mTxt = `${this.person.name} is inviting you to GoodAct platform. Join GoodAct to help people in time of need and to get help in your critical phase of life. This is also an oppurtunity to make your dreams true. So join by clicking on below link. ${window.location.protocol}//${environment.appUrl}/login?referrer=${encodeURIComponent(this.person.mobile)}`;
    var mLink = `${environment.appUrl}//${window.location.host}/login?referrer=${encodeURIComponent(this.person.mobile)}`;
    this._bottomSheet.open(ShareComponent, {data: {"mTxt": mTxt, "mLink": mLink}});
  }
}