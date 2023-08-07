import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl} from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import { EmploymentService } from './../../../employment.service';
import { SkillSet } from './../../../employment';

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

  profeciencyLevelSet: any = {1: "Novice", 2: "Advanced Beginner", 3: "Competent", 4: "Proficient", 5: "Expert"};

  skillSet: SkillSet = new SkillSet();

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

  constructor(
    private notifier: NotifierService,
    private employmentService: EmploymentService,
  ){
  }

  skillSelected(newTag){
    this.skillSet.selectedSkill = newTag;
  }

  ngOnInit(){
    this.fetchSkills();
  }

  acceptData(){
    var index = this.skillList.findIndex(ele => ele.selectedSkill === this.skillSet.selectedSkill);
    if(index === -1){
      this.skillList.push(this.skillSet);
    }else{
      this.skillList[index] = this.skillSet;
    }
  }

  lastUsedDateChange(event: MatDatepickerInputEvent<Date>) {
    this.skillSet.lastUsedDate = event.value;
  }

  fetchSkills(){
    this.employmentService.getPersonWork(this.key).subscribe(result=>{
      if(result.success){
        this.skillList = SkillSet.fromJSONArray(result.data.ss);
      }
    });
  }

  saveSkillSet(){
    this.employmentService.updatePersonWork(this.key, {ss: SkillSet.toJSONArray(this.skillList)}).subscribe(result=>{
      if(result.success){
        this.notifier.notify("success", "Skills updated successfully")
      }
    });
  }

  editSkill(mSkillSet){
    console.log(mSkillSet);
    this.skillSet = mSkillSet;
    this.lastUsedDateCntl = new FormControl(new Date(this.skillSet.lastUsedDate));
  }
}