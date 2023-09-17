import { AfterViewInit, Component, OnInit, ViewChild, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { CampaignService } from './../campaign.service';
import { NotifierService } from 'angular-notifier';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralService } from 'src/app/general.service';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { BeneficiaryEditorComponent } from './beneficiary-editor/beneficiary-editor.component';

const millisInADay = 24*60*60*1000;

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: []
})
export class BeneficiaryComponent implements OnInit {
  
    @Input("enableEdit") enableEdit: boolean = true;

    @Input("memberList") memberList = [];

    @Output("memberListUpdated") memberListUpdated: EventEmitter<any> = new EventEmitter();

    @Output("saveMembers") saveMembers: EventEmitter<any> = new EventEmitter();

    displayedColumns: string[] = ['pic','n', 'dob', 'gid','actions'];

    dataSource: MatTableDataSource<any> = new MatTableDataSource();

    @Input("campaignId") campaignId: string;
    @Input("bids") bids: any;
    totalBeneficiaries: number;
    
    

    constructor(
        private _bottomSheet: MatBottomSheet,
        private campaignService: CampaignService,
        private generalService: GeneralService,
        private notifier: NotifierService,
        private activatedRoute: ActivatedRoute,
    ){
        
    }
    
    fetchBeneficiaries(){
        this.campaignService.getBeneficiaries(this.bids.join(",")).subscribe(result=>{
            if(result.success){
              this.memberList = result.beneficiaries;
              this.memberList = this.memberList.map(ele=>{
                ele['dobStr'] = this.generalService.formatDateWithTimestamp(ele.dob*60*1000, "dd/mm/yyyy");
                return ele;
              });
              this.dataSource = new MatTableDataSource(this.memberList);
            }
        });
    }

  ngOnInit(){
    if(!this.enableEdit){
      this.displayedColumns = this.displayedColumns.filter(ele=>ele!='actions');
    }
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    for (let propName in changes) {
        let changedProp = changes[propName];
        if(propName === "memberList" && changedProp.currentValue !== undefined){
            this.dataSource.data = this.memberList;
        }
        if(propName === "bids" && changedProp.currentValue !== undefined){
           this.fetchBeneficiaries();
        }
        
    }
  }

  openMemberEditor(member: any, index: number = -1){
    var bottomSheet = this._bottomSheet.open(BeneficiaryEditorComponent, 
      {
        data: {
          beneficiary: member,
          cid: this.campaignId
        }
      }
    );

    bottomSheet.afterDismissed().subscribe(result=>{
      if(index===-1 && result){
        if(!this.memberList){
          this.memberList = [];
        }
        result['dobStr'] = this.generalService.formatDateWithTimestamp(result.dob*60*1000, "dd/mm/yyyy");
        this.memberList.push(result);
        this.dataSource.data = this.memberList;
      }else if(result){
          result['dobStr'] = this.generalService.formatDateWithTimestamp(result.dob*60*1000, "dd/mm/yyyy");
        this.memberList[index] = result;
      }

      // this.memberListUpdated.emit(this.memberList);
    });
  }

  save(){
    this.saveMembers.emit(this.memberList);
  }
}