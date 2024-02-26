import { 
  Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router, RoutesRecognized} from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { map, mergeMap, startWith, mergeMapTo } from 'rxjs/operators';
import {
  MatBottomSheet
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { TraderService } from '../../trader.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

const today = new Date();
const day = today.getDay();
const month = today.getMonth();
const year = today.getFullYear();

const orderStatusNotation = {P:"Pending", C:"Cancelled", E:"Executed", PE: "Partially Executed", PC:"Partially Cancelled", PR: "Processed"};

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.scss']
})
export class ListOrderComponent implements OnInit {

  rangeForm = new FormGroup({
    start: new FormControl(new Date(year, month, day)),
    end: new FormControl(new Date(year, month, day)),
  });

  orders: Array<any> = [];

  isEndReached: boolean = false;

  limit: number = 10;

  offset: number = 0;

  startDate: string;
  endDate: string;

  totalOrders: number = 0;

  constructor(
    private notifier: NotifierService,
    private traderService: TraderService
  ){

  }

  ngOnInit(){
    var currDate = new Date();
    var startDate = `${currDate.getFullYear()}/${currDate.getMonth()+1}/${currDate.getDate()}`;
    var endDate = `${currDate.getFullYear()}/${currDate.getMonth()+1}/${currDate.getDate()}`;
    this.getOrders(startDate, endDate);
  }

  getOrders(startDate: string, endDate: string){
    this.traderService.getOrders(startDate, endDate, this.limit, this.offset).subscribe(results=>{
      this.totalOrders = results[0]['totalRecords'][0]['totalCount'];
      var newOrders = results[0]['data'].map(ele=>{
        ele['s'] = orderStatusNotation[ele['s']];
        return ele;
      });
      this.orders = this.orders.concat(newOrders);
      this.offset = this.orders.length;
      
      if(this.orders.length >= this.totalOrders){
        this.isEndReached = true;
      }
    });
  }

  refresh(){
    this.offset = 0;
    this.isEndReached = false;

    this.startDate = this.rangeForm.value.start;
    this.endDate = this.rangeForm.value.end;
    
    this.getOrders(this.startDate, this.endDate)
  }


}