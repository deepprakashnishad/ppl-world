import { 
  Component, 
  OnInit, 
  ViewChild
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl} from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { CampaignService } from './../campaign.service';
// import { Slide } from "../../../shared/carousel/carousel.interface";
import { map, mergeMap, startWith, mergeMapTo } from 'rxjs/operators';

@Component({
  selector: 'app-wall-of-fame',
  templateUrl: './wall-of-fame.component.html',
  styleUrls: ['./wall-of-fame.component.scss']
})
export class WallOfFameComponent implements OnInit {

  limit: number = 50;
  donors: Array<any> = [];
  endOfDonorsReached:boolean = false;
  isRegular: boolean = false;

  constructor(
    private router: ActivatedRoute,
    private campaignService: CampaignService,
    private notifier: NotifierService
  ){

  }

  ngOnInit(){
    this.router.params.subscribe(params=>{
      if(params['campaignId']){
        this.getCampaignDonors(params['campaignId']); 
      }else{
        this.getDonors(0);
        this.isRegular = true;
      }
    });
  }

  getDonors(offset: number){
    this.campaignService.getRegularDonors(this.limit, offset).subscribe(result=>{
      if(result.success){
        if(result < this.limit){
          this.endOfDonorsReached = true;
        }  

        this.donors = result.donors;
      }else{
        this.notifier.notify("error", "Some error occurred. Please try again later.");
      }
    });
  }

  getCampaignDonors(campaignId, offset=0){
    this.campaignService.getCampaignDonors(campaignId ,this.limit, offset).subscribe(result=>{
      if(result.success){
        if(result < this.limit){
          this.endOfDonorsReached = true;
        }  

        this.donors = result.donors;
      }else{
        this.notifier.notify("error", "Some error occurred. Please try again later.");
      }
    }); 
  }
}