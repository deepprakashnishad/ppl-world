import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import {CampaignService} from './../campaign.service';
import {Campaign} from './../campaign';
import {SubscriptionComponent} from './../subscription/subscription.component';
import { DonateFromGAComponent } from './../../../payment/donate-from-ga/donate-from-ga.component';
import { Slide } from "../../../shared/carousel/carousel.interface";
import { AnimationType } from "../../../shared/carousel/carousel.animations";
import { CarouselComponent } from "../../../shared/carousel/carousel.component";

import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';


@Component({
  selector: 'app-view-campaign',
  templateUrl: './view-campaign.component.html',
  styleUrls: ['./view-campaign.component.scss']
})
export class ViewCampaignComponent implements OnInit {

	campaign: Campaign;

	@ViewChild(CarouselComponent) carousel: CarouselComponent;

  slides: Slide[] = [];

	constructor(
		private router: ActivatedRoute,
		private notifier: NotifierService,
    private _bottomSheet: MatBottomSheet,
		private campaignService: CampaignService
	){
	}

	ngOnInit(){
		this.router.params.subscribe(params=>{
			if(params['id']){
				this.getCampaignDetail(params['id']);	
			}
		});
	}

	getCampaignDetail(campaignId: string){
		this.campaignService.getCampaignDetail(campaignId).subscribe(result=>{
			this.campaign = Campaign.fromJSON(result);
			this.slides = [];
			for(var i=0;i<this.campaign.assets?.length;i++){
				this.slides.push({src: this.campaign.assets[i].downloadUrl})
			}	
		});
	}

  donateFromGoodAct(){
    const bottomSheet = this._bottomSheet.open(DonateFromGAComponent, {data: this.campaign});
    bottomSheet.afterDismissed().subscribe(result=>{
      console.log(result);
      if(result.id){
        this.notifier.notify("success", "Donation successfull");
      }
    });
  }

  donateFromBank(){

  }

  subscribeCampaign(){
  	const bottomSheet = this._bottomSheet.open(SubscriptionComponent, {data: this.campaign});
    bottomSheet.afterDismissed().subscribe(result=>{});	
  }
}