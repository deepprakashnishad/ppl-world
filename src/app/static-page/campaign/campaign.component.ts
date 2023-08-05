import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CampaignService} from './campaign.service';
import { StorageService } from './../../storage.service';
import {Campaign} from './campaign';


@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit {

	selectedCategory: string="health";
	catFormCntl = new FormControl('');

	categories: any;
	campaigns: Array<Campaign> = [];
	userId: string;

	constructor(
		private router: Router,
		private campaignService: CampaignService	
	){
		this.userId = sessionStorage.getItem("id");
	}

	ngOnInit(){
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

		this.campaignService.getCampaignsByCategory(this.selectedCategory)
		.subscribe(result=>{
			this.campaigns = Campaign.fromJSONArray(result);
		});
	}

	navigateToCreateCampaign(id: string, type: string = "view"){
		if(id && type==="edit"){
			this.router.navigate([`campaigns/edit/${id}`]);
		}else if(id && type==="view"){
			this.router.navigate([`campaigns/view/${id}`]);
		}else{
			this.router.navigate(['campaigns/edit']);
		}	
	}

	getCampaigns(){
		this.campaignService.getCampaignsByCategory(this.selectedCategory)
		.subscribe(result=>{
			console.log(result);
			this.campaigns = Campaign.fromJSONArray(result);
		});
	}
}