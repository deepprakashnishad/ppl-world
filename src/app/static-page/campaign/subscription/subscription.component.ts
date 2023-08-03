import { Component, NgZone, OnInit, Input, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
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

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<SubscriptionComponent>,
    private campaignService: CampaignService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private notifier: NotifierService
  ){
    if(data){
      this.campaign = data;
      if(this.campaign.reqf)
      	this.frequency = this.campaign.reqf;
    }
  }

  ngOnInit(){
  }

  subscribeToCampaign(){
  	if(this.amount < 25){
  		this.notifier.notify("error", "Minimum amount for donation is Rs 25.");
  		return;
  	}

    this.campaignService.getSubscription(this.campaign.id, this.amount, 
    	this.frequency, this.isAnonymous, this.startDate).subscribe(result=>{
    	if(result.success){
    		this.notifier.notify("success", "Campaign subscription completed successfully.");
    	}else{
    		this.notifier.notify("error", "Failed to subscribe to campaign.");
    	}
    });
  }

  startDateSelected(e){
	var selectedDate = new Date(e.value);
	this.startDate = selectedDate.getTime()/1000;
  }
}