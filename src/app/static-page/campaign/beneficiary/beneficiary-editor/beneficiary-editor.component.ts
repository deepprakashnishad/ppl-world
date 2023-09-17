import { Component, OnInit, ViewChild, EventEmitter, ElementRef, Inject, Input, Output, SimpleChange } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { CampaignService } from './../../campaign.service';
import { GeneralService } from 'src/app/general.service';
import {MatDialog} from '@angular/material/dialog';
import { NotifierService } from "angular-notifier";
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-beneficiary-editor',
  templateUrl: './beneficiary-editor.component.html',
  styleUrls: []
})
export class BeneficiaryEditorComponent implements OnInit {

  @Input("title") title: string = "Beneficiary";
  beneficiary: any = {"gid": {t: "adh"}};
  cid:string;
  chid:string;
  @Output("beneficiaryUpdated") beneficiaryUpdated: EventEmitter<any> = new EventEmitter();
  dobDateCntl: FormControl = new FormControl();
  birthdateTimestamp: number = 0;
    
    uploadPath: string = "";

  constructor(
    private campaignService: CampaignService,
    private notifier: NotifierService,
    private _bottomSheetRef: MatBottomSheetRef<BeneficiaryEditorComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ){
    if(data.beneficiary){
      this.beneficiary = data.beneficiary;
      console.log(this.beneficiary);
      this.uploadPath = `beneficiary/${this.beneficiary.id}`;
        this.dobDateCntl.setValue(new Date(this.beneficiary.dob*60*1000));
    }

    if(data.cid){
      this.cid = data.cid;
    }

    if(data.chid){
      this.chid = data.chid;
    }
  }

  ngOnInit(){}

  done(){
    this._bottomSheetRef.dismiss(this.beneficiary);
  }

  save(){
    this.campaignService.updateBeneficiary(this.beneficiary, this.cid, this.chid)
    .subscribe(result=>{
      if(result.success){
        this.beneficiary['id'] = result.id;
        this.uploadPath = `beneficiary/${this.beneficiary.id}`;
        this.notifier.notify("success", "Beneficiary updated successfully");
        delete result.success;
//        this._bottomSheetRef.dismiss(result);     
      }
    })
  }
    
    close(){
        this._bottomSheetRef.dismiss(this.beneficiary);
    }

  dobChange(event, type){
    this.beneficiary.dob = new Date(event.value).getTime()/60000;  
  }
    
    uploadCompleted(event, type){
        this.beneficiary[type] = event.downloadUrl;
    }
}