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

import {EmploymentType} from 'src/app/my-constants';

const millisInADay = 24*60*60*1000;

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss']
})
export class ProfileEditorComponent implements OnInit {

  past18YearsDates = (d: Date | null): boolean => {
    var currDate = new Date();
    // Prevent Saturday and Sunday from being selected.
    if(d){
      return d.getTime()<(currDate.getTime()-17*365*millisInADay);
    }else{
      return false;
    }    
  };

  employmentTypes: Array<any> = EmploymentType;

  minMarriageAge: number = 18;

  dobDateCntl: FormControl = new FormControl();

  prefMinDobDateCntl: FormControl = new FormControl();

  prefMaxDobDateCntl: FormControl = new FormControl();

  mp: MarriageProfile = new MarriageProfile();

  birthTime: string;

  birthdateTimestamp: number = 0;
  birthTimeTimestamp: number = 0;

  profilePicUploadPath: string;

  otherImageUploadPath: string;

  personId: string;

  constructor(
    private marraigeService: MarriageService,
    private notifier: NotifierService,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.personId = sessionStorage.getItem("id");
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

              this.otherImageUploadPath = `person/${this.personId}/marriage-images/${this.mp.id}`;
              this.profilePicUploadPath = `person/${this.personId}/marriage-profile/${this.mp.id}`;

              this.birthTime = `${birthHr}:${birthMin} ${meredian}`;
              this.dobDateCntl.setValue(new Date(this.birthdateTimestamp*60*1000));
            }

            if(this.mp.pref.minDoB){
              this.prefMinDobDateCntl.setValue(new Date(this.mp.pref.minDoB*60*1000));
            }

            if(this.mp.pref.maxDoB){
              this.prefMaxDobDateCntl.setValue(new Date(this.mp.pref.maxDoB*60*1000));
            }

            if(this.mp.o !== this.personId){
              this.router.navigate(['/marriage-profile-viewer', this.mp.id]);
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

  dobChange(event, type){
    if(type==="date"){
      this.birthdateTimestamp = new Date(event.value).getTime()/60000;
    }else if(type==="time"){
      var res = event.split(" ");
      var time = res[0].split(":");
      if(res[1]==="PM"){
        time[0] = Number(time[0])+12;
      }
      this.birthTimeTimestamp = time[0]*60+Number(time[1]);
    }
    this.mp.dob = this.birthdateTimestamp + this.birthTimeTimestamp;
  }

  prefDateChange(event, type){
    this.mp.pref[type] = new Date(event.value).getTime()/60000;
  }

  save(){
    if(this.mp.o !== this.personId){
      this.notifier.notify("error", "Unauthorized access");
      return;
    }

    this.marraigeService.updateProfile(this.mp).subscribe(result=>{
      if(result.success){
        this.notifier.notify("success", "Marriage profile updated successfully");
        if(!this.mp.id){
          this.mp.id = result.id;
          this.otherImageUploadPath = `person/${this.personId}/marriage-images/${this.mp.id}`;
          this.profilePicUploadPath = `person/${this.personId}/marriage-profile/${this.mp.id}`;

          this.router.navigate(['marriage-profile-editor', this.mp.id]);
        }
      }else{
        this.notifier.notify("error", "Failed to update marriage profile");
      }
    });
  }

  tagSelected(event, type){
    this.mp[type] = event.tagId;
  }

  eduTagSelected(event, type){
    this.mp.e[type] = event.tagId;
  }

  profTagSelected(event, type){
    this.mp.pr[type] = event.tagId;
  }

  selectedTagChipsModified(event, type){
    this.mp[type] = event.map(ele=>ele.tid);
  }

  selectedPrefTagChipsModified(event, type){
    this.mp.pref[type] = event.map(ele=>ele.tid);
  }

  addressSelected(event){
    this.mp.addr = event? event.id: undefined;
  }

  imagesUploaded(event, type){
    if(type==="profile"){
      this.mp.pp = event;
    }else{
      if(!this.mp.ap){
        this.mp.ap = [];
      }
      this.mp.ap.push(event);
    }    
    this.save();
  }
}