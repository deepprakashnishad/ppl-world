import { 
  Component, 
  OnInit, 
  ViewChild
} from '@angular/core';
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

  constructor(
    private campaignService: CampaignService,
    private notifier: NotifierService
  ){

  }

  ngOnInit(){
    this.getDonors(0);
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
}