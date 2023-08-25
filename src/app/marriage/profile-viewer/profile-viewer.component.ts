import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MarriageService } from './../marriage.service';
import { NotifierService } from 'angular-notifier';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {AddressService} from 'src/app/shared/address/address.service';
import { GeneralService } from 'src/app/general.service';
import { Observable } from 'rxjs/Observable';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { MarriageProfile } from './../marriage';
import { Slide } from "src/app/shared/carousel/carousel.interface";
import { AnimationType } from "src/app/shared/carousel/carousel.animations";
import { CarouselComponent } from "src/app/shared/carousel/carousel.component";

import {EmploymentType} from 'src/app/my-constants';

const millisInADay = 24*60*60*1000;

@Component({
  selector: 'app-profile-viewer',
  templateUrl: './profile-viewer.component.html',
  styleUrls: []
})
export class ProfileViewerComponent implements OnInit {

  dateOfBirth: string;
  prefSpouseMinDob: string;
  prefSpouseMaxDob: string;

  birthTimeTimestamp: number;
  birthdateTimestamp: number;

  birthTime: string;

  mp: MarriageProfile = new MarriageProfile();

  @ViewChild(CarouselComponent) carousel: CarouselComponent;

  slides: Slide[] = [];

  constructor(
    private marraigeService: MarriageService,
    private notifier: NotifierService,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.route.params.subscribe(params=>{
      if(params.id){
        this.marraigeService.getProfileDetail(params.id).subscribe(result=>{
          if(result.success){
            this.mp = MarriageProfile.fromJSON(result.data);  
            if(this.mp.dob && this.mp.dob>0){
              this.birthTimeTimestamp = this.mp.dob%(24*60);
              this.birthdateTimestamp = this.mp.dob - this.birthTimeTimestamp;

              var birthHr = Math.floor(this.birthTimeTimestamp/60);
              var birthMin = this.birthTimeTimestamp%60;
              var meredian = "AM";
              if(birthHr > 12){
                meredian = "PM";
                birthHr = birthHr - 12;
              }
              this.birthTime = `${birthHr}:${birthMin} ${meredian}`;
              this.dateOfBirth = (new Date(this.birthdateTimestamp*60*1000)).toString();
            }

            if(this.mp.pref.minDoB){
              this.prefSpouseMinDob = new Date(this.mp.pref.minDoB*60*1000).toString();
            }

            if(this.mp.pref.maxDoB){
              this.prefSpouseMaxDob = new Date(this.mp.pref.maxDoB*60*1000).toString();
            }

            if(this.mp.pp){
              this.slides[0] = {src: this.mp.pp.downloadUrl};
            }

            if(this.mp.ap){
              this.mp.ap.forEach(ele=>{
                this.slides.push({src: ele.downloadUrl})  
              })
            }

          }else{
            this.notifier.notify("error", "Failed to get profile details")
          }          
        })
      }
    })
  }

  ngOnInit(){

  }

  getEmploymentType(value){
    var et = EmploymentType.find(ele=>ele.value===value);
    return et.displayName;
  }

  getBirthdate(mTimeStamp){
    return (new Date(mTimeStamp*60*1000)).toString();
  }
}