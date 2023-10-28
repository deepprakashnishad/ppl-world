import { AfterViewInit, Component, OnInit, ViewChild, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl} from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import { EmploymentService } from './../../../employment.service';
import { SkillSet, WorkSummary, RateList, WorkLocation } from './../../../employment';
import { MyIdbService } from 'src/app/my-idb.service';
import { GeneralService } from 'src/app/general.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-service-detail-form',
  templateUrl: './service-detail-form.component.html',
  styleUrls: ['./service-detail-form.component.scss']
})
export class ServiceDetailFormComponent implements OnInit {

  @Input() key: string;
  @Input() data: any;

  skillList: Array<SkillSet> = [];
  ws: WorkSummary = new WorkSummary();
  rl: RateList = new RateList();
  loc: WorkLocation = new WorkLocation;

  profeciencyLevelSet: any = {1: "Novice", 2: "Advanced Beginner", 3: "Competent", 4: "Proficient", 5: "Expert"};

  skillSet: SkillSet = new SkillSet();

  id: string;

  noFutureDates = (d: Date | null): boolean => {
    var currDate = new Date();
    // Prevent Saturday and Sunday from being selected.
    if(d){
      return d.getTime()<currDate.getTime();
    }else{
      return false;
    }    
  };

  lastUsedDateCntl: FormControl;

  @Output("workDeleted") workDeleted: EventEmitter<any> = new EventEmitter();

  workLocationOptions = {
    "wfh": "Work from home",
    "d": "Within x kms",    
  };

  workLocationKeys: Array<String>=[];

  selectedLocationType: string = "wfh";

  latLng: any;

  profilePicUploadPath: string;

  workImageUploadPath: string;

  personId: string;

  selectedLanguage: string;

  constructor(
    private notifier: NotifierService,
    private employmentService: EmploymentService,
    private idbService: MyIdbService,
    private generalService: GeneralService
  ){
    this.personId = sessionStorage.getItem("id");
  }

  tagSelected(newTag, type){
    if(type==="skill"){
      this.skillSet.selectedSkill = newTag.tagId;  
    }else if(type==="role"){
      this.ws.r = newTag.tagId;
    }
  }

  ngOnInit(){
    this.workLocationKeys = Object.keys(this.workLocationOptions);

    this.generalService.selectedLanguage.subscribe(lang => {
      this.selectedLanguage = lang;
    });
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    for (let propName in changes) {
      let changedProp = changes[propName];
      if(propName.toLowerCase() === "data" && changedProp.currentValue !== undefined){
        var data = changedProp.currentValue;
        if(data.workDetail){
          this.id = data.workDetail.id;
          this.workImageUploadPath = `person/${this.personId}/work-images/${this.id}`;
          this.profilePicUploadPath = `person/${this.personId}/work-profile/${this.id}`;
          this.skillList = SkillSet.fromJSONArray(data.workDetail.ss);

          this.getSkillTagsByTagId();
          this.ws = WorkSummary.fromJSON(data.workDetail.ws);
          this.rl = RateList.fromJSON(data.workDetail.rl);
          this.loc = WorkLocation.fromJSON(data.workDetail.l);
          if(this.loc && this.loc.t==="d"){
            this.selectedLocationType = this.loc.t;
            this.latLng = this.loc.c.ll;
          }
        }        
      }
    }
  }

  async getSkillTagsByTagId(){
    for(var i=0;i< this.skillList.length; i++){
      var result = await this.idbService.getTagDetail(this.skillList[i]['selectedSkill']);
      this.skillList[i]['skillTag'] = result['tags'];  
    }
  }

  async acceptData(){
    var index = this.skillList.findIndex(ele => ele.selectedSkill === this.skillSet.selectedSkill);
    var result = await this.idbService.getTagDetail(this.skillSet['selectedSkill']);
    this.skillSet['skillTag'] = result.tags;
    if(index === -1){
      this.skillList.push(this.skillSet);
    }else{
      this.skillList[index] = this.skillSet;
    }

    this.skillSet = new SkillSet();
  }

  lastUsedDateChange(event: MatDatepickerInputEvent<Date>) {
    this.skillSet.lastUsedDate = event.value;
  }

  fetchWorkDetails(){
    this.employmentService.getPersonWork(this.key).subscribe(result=>{
      if(result.success){
        this.id = result.data.id;
        this.workImageUploadPath = `person/${this.personId}/work-images/${this.id}`;
        this.profilePicUploadPath = `person/${this.personId}/work-profile/${this.id}`;
        this.skillList = SkillSet.fromJSONArray(result.data.ss);

        this.getSkillTagsByTagId();

        this.ws = WorkSummary.fromJSON(result.ws);
        this.rl = RateList.fromJSON(result.rl);
        this.loc = WorkLocation.fromJSON(result.l);

        if(this.loc && this.loc.t==="d"){
          this.selectedLocationType = this.loc.t;
          this.latLng = this.loc.c.ll;
        }
      }else{
        this.notifier.notify("error", "Could not fetch work details");
      }
    });
  }

  saveWorkDetail(type){
    var data;
    if(type==="skill"){
      data = {ss: SkillSet.toJSONArray(this.skillList)};
    }else if(type==="summary"){
      data = {"ws": this.ws, rl: this.rl};
    }else if(type==="location"){
      if(this.loc.t==="wfh"){
        this.loc.d = undefined;
        this.loc.c = undefined;
      }else if(type==="d" && (!this.loc.d || !this.loc.c || !this.loc.c.ll)){
        this.notifier.notify("error", "Distance and location details required");
        return;
      }

      data = {"l": {"t": this.loc.t, "c": this.loc.c, "d": this.loc.d}};
    }else{
      return;
    }

    this.employmentService.updatePersonWork(this.key, data).subscribe(result=>{
      if(result.success){
        this.notifier.notify("success", "Work detail updated successfully");
      }else{
        this.notifier.notify("error", "Failed to update work detail");
      }
    }); 
  }

  editSkill(mSkillSet){
    this.skillSet = mSkillSet;
    this.lastUsedDateCntl = new FormControl(new Date(this.skillSet.lastUsedDate));
  }

  locationTypeSelected(key){
    this.selectedLocationType = key;
    this.loc.t = key;
  }

  locationSelected(event){
    this.loc.c = event;
  }

  deleteWork(){
    this.employmentService.deleteWork(this.key).subscribe(result=>{
      if(result.success){
        this.notifier.notify("success", "Work deleted successfully");
        this.workDeleted.emit(this.key);
      }
    });
  }

  imagesUploaded_session(event, type){
    var data = {};
    var workImages = sessionStorage.getItem("work-images");
    if(workImages){
      data = JSON.parse(workImages);
      if(data[this.id]){
        if(type==="profile"){
          data[this.id][type] = event;    
        }else{
          data[this.id][type] = data[this.id][type].push(...event);    
        }
      }else{
        data[this.id] = {};
        data[this.id][type] = event;
      }
    }else{
      data[this.id] = {};
      data[this.id][type] = event;
    } 
    sessionStorage.setItem("work-images", JSON.stringify(data));
     
  }

  imagesUploaded(event, type){
    if(type==="profile"){
      this.ws.p = event;
    }else{
      if(!this.ws.wi){
        this.ws.wi = [];
      }
      this.ws.wi.push(event);
    }    
    this.employmentService.updatePersonWork(this.key, {"ws": this.ws}).subscribe(result=>{
      if(result.success){
        this.notifier.notify("success", "Work images uploaded successfully");
      }else{
        this.notifier.notify("error", "Failed to update work detail");
      }
    }); 
  }
}