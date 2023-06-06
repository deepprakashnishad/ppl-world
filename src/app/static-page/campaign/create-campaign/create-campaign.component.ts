import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import {CampaignService} from './../campaign.service';
import {Campaign} from './../campaign';


@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss']
})
export class CreateCampaignComponent implements OnInit {

	selectedCategory: string="health";
	catFormCntl = new FormControl('');
	expiryDateCntl = new FormControl();
	campaignId: string;
	categories: any;
	campaign: Campaign = new Campaign();
	userId: string;
	enableEditMode: boolean = true;

	constructor(
		private router: ActivatedRoute,
		private notifier: NotifierService,
		private campaignService: CampaignService
	){
		this.categories = [
			{key: "health", value: "Health/Medical"},
			{key: "startup", value: "Entrepreneur"},
			{key: "education", value: "Education"},
			{key: "adoption", value: "Adoption"},
			{key: "agriculture", value: "Agriculture"},
			{key: "animal", value: "Animal Welfare"},
			{key: "children", value: "Children Welfare"},
			{key: "woman", value: "Woman Empowerment"},
			{key: "disaster", value: "Disaster Relief"},
			{key: "personal", value: "Personal Causes"},
			{key: "farmers", value: "Farmers"},
			{key: "religious", value: "Religious"},
			{key: "food", value: "Food for all"}
		];
	}

	ngOnInit(){
		this.router.params.subscribe(params=>{
			// this.campaignId = params['id'];
			this.getCampaignDetail(params['id']);
		})

		this.userId = sessionStorage.getItem("id");
	}

	getCampaignDetail(campaignId: string){
		this.campaignService.getCampaignDetail(campaignId).subscribe(result=>{
			this.campaign = Campaign.fromJSON(result);

			this.expiryDateCntl.setValue(new Date(this.campaign.expiryDate*1000));

			if(this.campaign.owner!==this.userId){
				this.enableEditMode = false;
			}
		});
	}

	saveCampaign(){
		if(this.campaign.id){
			this.campaignService.updateCampaign(this.campaign).subscribe(result=>{
				this.campaign = Campaign.fromJSON(result);
				this.notifier.notify("success", "Campaign updated successfully");
			});
		}else{
			this.campaignService.postCampaign(this.campaign).subscribe(result=>{
				this.campaign = Campaign.fromJSON(result);
				this.notifier.notify("success", "Campaign created successfully");
			});
		}
		
	}

	expiryDateSelected(e){
		var selectedDate = new Date(e.value);
		this.campaign.expiryDate = selectedDate.getTime()/1000;
	}
}