import { Component, NgZone, OnInit, Input, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { CampaignService } from '../campaign.service';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA
} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  campaign: any;
  frequency: string="M";
  amount: number = 500;
  isAnonymous: boolean = false;
  startDate: number;
  isLoggedIn: boolean;
    inspiration: any;
    canSubscribeOtherDonors: boolean = false;
    subscriptionForSelf: boolean = true;
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<SubscriptionComponent>,
    private campaignService: CampaignService,
    private authenticationService: AuthenticationService,
    private router: Router,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private notifier: NotifierService
  ){
    this.authenticationService.isLoggedIn.subscribe(res=>this.isLoggedIn = res)
    if(data){
      this.campaign = data;
      if(this.campaign.reqf)
      	this.frequency = this.campaign.reqf;
    }
  }

  ngOnInit(){
    if(!this.isLoggedIn){
      this.authenticationService.redirectUrl = this.router.url;
      this.router.navigate(['/login']);
      this._bottomSheetRef.dismiss();
    }
      
      this.canSubscribeOtherDonors = this.authenticationService.authorizeUser(['SUBSCRIBE_DONORS']);
      
      if(this.canSubscribeOtherDonors){
          this.subscriptionForSelf = false;
      }
  }


  subscribeToCampaign(){
  	if(this.amount < 50){
  		this.notifier.notify("error", "Minimum amount for donation is Rs 50.");
  		return;
  	}
      console.log(this.subscriptionForSelf);
        if(this.subscriptionForSelf){
            this.campaignService.getSubscription(this.campaign.id, this.amount, 
            this.frequency, this.isAnonymous, this.startDate, this.inspiration).subscribe(result=>{
                if(result.success){
                    this.notifier.notify("success", "Campaign subscription completed successfully.");
                this._bottomSheetRef.dismiss();
                }else{
                    this.notifier.notify("error", "Failed to subscribe to campaign.");
                }
            });
        }else{
            this.campaignService.subscribeDonor(this.campaign.id, this.amount, 
            this.frequency, this.isAnonymous, this.startDate, this.inspiration).subscribe(result=>{
                if(result.success){
                    this.notifier.notify("success", "Campaign subscription completed successfully.");
                this._bottomSheetRef.dismiss();
                }else{
                    this.notifier.notify("error", "Failed to subscribe to campaign.");
                }
            });
        }
  }

  startDateSelected(e){
  	var selectedDate = new Date(e.value);
  	this.startDate = selectedDate.getTime()/1000;
  }

  inspirationSelected(e, type){
    if(e.person){
      this.inspiration = e.person.id;
    }else{
      this.inspiration = e.id;
    }
  }
}