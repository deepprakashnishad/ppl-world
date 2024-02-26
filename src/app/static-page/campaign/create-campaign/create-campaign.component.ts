import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { AngularFireStorage } from '@angular/fire/storage';
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

	uploadPath: string;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private notifier: NotifierService,
		private afs: AngularFireStorage,
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
		this.activatedRoute.params.subscribe(params=>{
			if(params['id']){
				this.getCampaignDetail(params['id']);	
			}
			
		})

		this.userId = sessionStorage.getItem("id");
	}

	getCampaignDetail(campaignId: string){
		this.campaignService.getCampaignDetail(campaignId).subscribe(result=>{
			this.campaign = Campaign.fromJSON(result);

			this.uploadPath = `/campaigns/${campaignId}/`;

			this.expiryDateCntl.setValue(new Date(this.campaign.expiryDate*1000));
			if(this.campaign.id && (this.campaign.owner.id!==this.userId && this.campaign.owner!==this.userId)){
				this.enableEditMode = false;
			}
		});
	}

	saveCampaign(){
		if(!this.validateCampaign()){
			return;
		}
		if(this.campaign.id){
			delete this.campaign['createdAt'];
			this.campaignService.updateCampaign(this.campaign).subscribe(result=>{
				this.campaign = Campaign.fromJSON(result);
				this.notifier.notify("success", "Campaign updated successfully");
			});
		}else{
			this.campaignService.postCampaign(this.campaign).subscribe(result=>{
				if(result.success){
					this.campaign = Campaign.fromJSON(result);
					this.uploadPath = `/campaigns/${this.campaign.id}`;
					console.log(this.uploadPath);
					this.notifier.notify("success", "Campaign created successfully");	
					console.log("Finally done");
				}else{
					this.notifier.notify("error", "Failed to create campaign");	
				}
				
			});
		}
	}

	expiryDateSelected(e){
		var selectedDate = new Date(e.value);
		this.campaign.expiryDate = selectedDate.getTime()/1000;
	}

	uploadCompleted(event){
		if(!this.campaign.assets){
			this.campaign.assets = [event];
		}else{
			this.campaign.assets.push(event);	
		}

		delete this.campaign.createdAt;
		
		this.campaignService.updateCampaign(this.campaign).subscribe(result=>{
			this.campaign = Campaign.fromJSON(result);
			this.notifier.notify("success", "Campaign updated successfully");
		});
	}

	deleteImage(event, index){
    this.campaign.assets.splice(index, 1);
    if(this.campaign.hasOwnProperty("id") && this.campaign.id !== undefined){
    	if(!this.validateCampaign()){
    		return;
    	}
    	delete this.campaign['createdAt'];
    	this.campaignService.updateCampaign(this.campaign).subscribe(result=>{
				this.campaign = Campaign.fromJSON(result);
				this.notifier.notify("success", "Campaign updated successfully");
				this.afs.ref(event['uploadPath']).delete().subscribe(result=>{
          console.log(result);
        })
			});
    }else{
      this.notifier.notify("success", `Campaign id is missing`);
    }
  }

	navigateTo(url){
		this.router.navigate([url, this.campaign.id])
	}

	validateCampaign(){
		if(!this.campaign.title){
			this.notifier.notify("error", "Title missing");
			return false;
		}
		if(!this.campaign.areqd){
			this.notifier.notify("error", "Amount required missing");
			return false;
		}
		if(!this.campaign.cat){
			this.notifier.notify("error", "Category missing");
			return false;
		}

		if(!this.campaign.desc && this.campaign.desc.length<200){
			this.notifier.notify("error", "Description should have atleast 200 characters");
			return false;
		}
		if(!this.campaign.s){
			this.notifier.notify("error", "Status missing");
			return false;
		}
		return true;
	}
}