import { 
  Component, 
  OnInit, 
} from '@angular/core';
import {FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ReportService } from './../report.service';
import { ActivatedRoute } from '@angular/router';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-sale-report',
  templateUrl: './sale-report.component.html',
  styleUrls: ['./sale-report.component.scss']
})
export class SaleReportComponent implements OnInit {

  rangeForm = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });

  transactions: Array<any> = [];

  isEndReached: boolean = false;

  limit: number = 10;

  offset: number = 0;

  startDate: string;
  endDate: string;

  totalResult: number = 0;

  totalCommission: number = 0;
  totalSaleAmount: number = 0;

  reportType: string = "downline-report";

  constructor(
    private notifier: NotifierService,
    private reportService: ReportService,
    private route: ActivatedRoute
  ){

  }

  ngOnInit(){
    var currDate = new Date();
    var startDate = `${currDate.getFullYear()}/${currDate.getMonth()+1}/${currDate.getDate()}`;
    var endDate = new Date(new Date().setDate(currDate.getDate() + 1));
    this.route.params.subscribe(params=>{
      if(params['type']==="my-report"){
        this.reportType = "my-report";  
      }
      this.getTransactionReport(
        startDate,
        `${endDate.getFullYear()}/${endDate.getMonth()+1}/${endDate.getDate()}`
      );
    });
  }

  getTransactionReport(startDate: string, endDate: string){
    this.reportService.getSaleReport(startDate, endDate, this.limit, this.offset, this.reportType).subscribe(results=>{
      this.totalResult = results[0]['totalRecords'][0]['totalCount'];
      this.totalCommission = results[0]['totalCommission'][0]['total'];
      this.totalSaleAmount = results[0]['totalAmount'][0]['total'];
      this.transactions = this.transactions.concat(results[0]['data']);
      this.offset = this.transactions.length;
      
      if(this.transactions.length >= this.totalResult){
        this.isEndReached = true;
      }
    });
  }

  refresh(){
    this.offset = 0;
    this.isEndReached = false;

    this.startDate = this.rangeForm.value.start;
    this.endDate = this.rangeForm.value.end;
    
    this.getTransactionReport(this.startDate, this.endDate)
  }
}