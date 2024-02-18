import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import {CampaignService} from './../campaign.service';
import {Campaign} from './../campaign';
import {SubscriptionComponent} from './../subscription/subscription.component';
import { DonateFromGAComponent } from './../../../payment/donate-from-ga/donate-from-ga.component';
import { PaymentComponent } from './../../../payment/payment.component';
import { CollectDonationFromOthersComponent } from './../collect-donation-from-others/collect-donation-from-others.component';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { Slide } from "../../../shared/carousel/carousel.interface";
import { AnimationType } from "../../../shared/carousel/carousel.animations";
import { CarouselComponent } from "../../../shared/carousel/carousel.component";
import { ShareComponent } from 'src/app/shared/share/share.component';
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

	campaign: Campaign = new Campaign();

	@ViewChild(CarouselComponent) carousel: CarouselComponent;

  slides: Slide[] = [];

  canCollectDonation:boolean = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private notifier: NotifierService,
    private _bottomSheet: MatBottomSheet,
		private campaignService: CampaignService,
		private authenticationService: AuthenticationService
	){
		this.canCollectDonation = this.authenticationService.authorizeUser(['CAN_COLLECT_DONATION']);
	}

	ngOnInit(){
		this.activatedRoute.params.subscribe(params=>{
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

	openShareBottomSheet(){
    var mTxt = `${this.campaign.title}\n${this.campaign.desc}\n${window.location.href}`;
    var mLink = window.location.href;
    this._bottomSheet.open(ShareComponent, {data: {"mTxt": mTxt, "mLink": mLink}});
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
		const bottomSheet = this._bottomSheet.open(PaymentComponent, {
			data: {
				displayDetails: {
					title: "Donation"
				},
				order: {
					prod: this.campaign.title,
					prodId: this.campaign.id,
					prodDesc: `Donation for ${this.campaign.title}`,
					title: `Donation`,
          qty: 1,
          desc: `Donation for ${this.campaign.title}`,
          action: "donation"
				},
				redirectUrl: "/explore",
				action_name: "Donate"
			}
		});
    bottomSheet.afterDismissed().subscribe(result=>{
      if(result && result.id){
        this.notifier.notify("success", "Donation successfull");
      }
    });
  }

  collectFromOthers(){
  	const bottomSheet = this._bottomSheet.open(CollectDonationFromOthersComponent, {data: this.campaign});
    bottomSheet.afterDismissed().subscribe(result=>{
    	this.notifier.notify("success", "Donation collection successfull");
    });	
  }

  subscribeCampaign(){
  	const bottomSheet = this._bottomSheet.open(SubscriptionComponent, {data: this.campaign});
    bottomSheet.afterDismissed().subscribe(result=>{});	
  }

  viewDonors(){
  	this.router.navigate([`wall-of-fame/${this.campaign.id}`]);
  }
}