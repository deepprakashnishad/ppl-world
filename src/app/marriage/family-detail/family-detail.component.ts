import { Component, OnInit, ViewChild, EventEmitter, ElementRef, Inject, Input, Output, SimpleChange } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { GeneralService } from 'src/app/general.service';
import {MatDialog} from '@angular/material/dialog';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-family-detail-input',
  templateUrl: './family-detail.component.html',
  styleUrls: []
})
export class FamilyDetailComponent implements OnInit {

  @Input("title") title: string = "Family Member Form";
  fd: any = {};
  @Output("familyDetailUpdated") familyDetailUpdated: EventEmitter<any> = new EventEmitter();

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<FamilyDetailComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ){
    if(data){
      this.fd = data;
      console.log(this.fd);
    }
  }

  ngOnInit(){}

  done(){
    this._bottomSheetRef.dismiss(this.fd);
  }

  tagSelected(event, type){
    this.fd[type] = event.tagId;
  }
}