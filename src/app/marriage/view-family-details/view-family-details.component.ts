import { AfterViewInit, Component, OnInit, ViewChild, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MarriageService } from './../marriage.service';
import { NotifierService } from 'angular-notifier';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {AddressService} from 'src/app/shared/address/address.service';
import { Observable } from 'rxjs/Observable';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { MarriageProfile } from './../marriage';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { FamilyDetailComponent } from './../family-detail/family-detail.component';

const millisInADay = 24*60*60*1000;

@Component({
  selector: 'app-view-family-details',
  templateUrl: './view-family-details.component.html',
  styleUrls: []
})
export class ViewFamilyDetailsComponent implements OnInit {

  @Input("enableEdit") enableEdit: boolean = true;

  @Input("memberList") memberList = [];

  @Input("showAnnualIncome") showAnnualIncome: boolean = true;

  @Output("memberListUpdated") memberListUpdated: EventEmitter<any> = new EventEmitter();

  @Output("saveMembers") saveMembers: EventEmitter<any> = new EventEmitter();

  displayedColumns: string[] = ['n', 'r', 'd','c', 'i', 'actions'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(
    private _bottomSheet: MatBottomSheet
  ){}

  ngOnInit(){
    if(!this.enableEdit){
      this.displayedColumns = this.displayedColumns.filter(ele=>ele!='actions');
    }
    if(!this.showAnnualIncome){
      this.displayedColumns = this.displayedColumns.filter(ele=>ele!='i'); 
    }
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    for (let propName in changes) {
      let changedProp = changes[propName];
      if(propName === "memberList" && changedProp.currentValue !== undefined){
        this.dataSource.data = this.memberList;
      }
    }
  }

  openFamilyDetailEditor(familyDetail: any, index: number = -1){
    var bottomSheet = this._bottomSheet.open(FamilyDetailComponent, {data: familyDetail});

    bottomSheet.afterDismissed().subscribe(result=>{
      if(index===-1 && result){
        if(!this.memberList){
          this.memberList = [];
        }
        this.memberList.push(result);
        this.dataSource.data = this.memberList;
      }else if(result){
        this.memberList[index] = result;
      }

      // this.memberListUpdated.emit(this.memberList);
    });
  }

  save(){
    this.saveMembers.emit(this.memberList);
  }
}