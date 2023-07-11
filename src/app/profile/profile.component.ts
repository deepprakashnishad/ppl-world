import { 
  Component, 
  OnInit, 
} from '@angular/core';
import {FormControl} from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ProfileService } from './profile.service';
import { GeneralService } from './../general.service';
import { Person } from  './../person/person';
import { environment } from './../../environments/environment';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { map, mergeMap, startWith, mergeMapTo } from 'rxjs/operators';
import { ShareComponent } from './../shared/share/share.component';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

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

  joiningCharges: number = environment.joiningCharges;

  uploadPath: string = "";

  order: any;


  constructor(
    private profileService: ProfileService,
    private afMessaging: AngularFireMessaging,
    private generalService: GeneralService,
    private _bottomSheet: MatBottomSheet,
    private notifier: NotifierService
  ){

  }

  ngOnInit(){
    this.profileService.getPersonDetail().subscribe(result=>{
      this.person = Person.fromJSON(result);
      if(this.person.status==="APPROVAL_PENDING" && this.person.currOrbit===0){
        this.order = {
          amount: environment.joiningCharges, 
          person: this.person.id, 
          product: "Starter Plan Activation"
        }
      }

      this.uploadPath = this.person.id;
      
      this.keys = Object.keys(this.person.lwdlc);
      for(var i=0;i < this.keys.length;i++){
        var currLevel = this.keys[i];
        var clKeys = Object.keys(this.person.lwdlc[currLevel]);
        if(clKeys.length > this.maxChildOrbit){
          this.maxChildOrbit = clKeys.length-1;
        }
      }
    });
  }

  newPersonSelected($event){
    this.selectedPersonForApproval = $event;
  }

  approve(){
    if(this.person.amtWithdrawable < this.joiningCharges){
      this.notifier.notify("error", `Insufficient balance. ${this.joiningCharges - this.person.amtWithdrawable} more is required.`);
    }else if(this.selectedPersonForApproval.s !== "APPROVAL_PENDING"){
      this.notifier.notify("error", `${this.selectedPersonForApproval.n} is already joined`);
    }else{
      this.profileService.approveNewJoinee(
        this.selectedPersonForApproval.id, this.joiningCharges
      ).subscribe(result=>{
        if(result['success']){
          this.notifier.notify("success", "Approval successfull");
        }else{
          this.notifier.notify("error", "Approval failed");
        }
      });
    }
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
    var mTxt = `${this.person.name} is inviting you to GoodAct platform. Join GoodAct to help people in time of need and to get help in your critical phase of life. This is also an oppurtunity to make your dreams true. So join by clicking on below link. ${window.location.protocol}//${window.location.host}/login?referrer=${encodeURIComponent(this.person.mobile)}`;
    this._bottomSheet.open(ShareComponent, {data: {"mTxt": mTxt}});
  }

  transferCreditsToSelected($event){
    this.transferCreditsTo = $event; 
    console.log(this.transferCreditsTo);
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
      console.log(result);
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
}