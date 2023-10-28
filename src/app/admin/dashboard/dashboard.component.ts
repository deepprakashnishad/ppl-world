import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { ReportService } from '../reports/report.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  range: FormGroup;
  startDate: Date;
  endDate: Date;

  totalSaleAmount: number;

  datewiseSaleReport: Array<any> = [];
  constructor(
    private reportService: ReportService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.range = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });

    this.endDate = new Date();
    this.endDate.setHours(23);
    this.endDate.setSeconds(59);
    this.endDate.setMinutes(59);
    this.endDate.setMilliseconds(999);

    this.startDate = new Date();
    this.startDate.setDate(1);
    this.endDate.setHours(0);
    this.endDate.setSeconds(0);
    this.endDate.setMinutes(0);
    this.endDate.setMilliseconds(0);    
    
    this.range.get("start").setValue(this.startDate);
    this.range.get("end").setValue(this.endDate);

    this.fetchSalesReport();
  }

  fetchSalesReport(){
    this.reportService.getOrdersByDate(this.startDate.getTime(), this.endDate.getTime())
    .subscribe(results=>{
      
    });
  }
}