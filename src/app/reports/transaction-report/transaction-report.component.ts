import { 
  Component, 
  OnInit, 
} from '@angular/core';
import {FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ReportService } from './../report.service';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-transaction-report',
  templateUrl: './transaction-report.component.html',
  styleUrls: ['./transaction-report.component.scss']
})
export class TransactionReportComponent implements OnInit {

  rangeForm = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });

  transactions: Array<any> = [];

  isEndReached: boolean = false;

  limit: number = 50;

  offset: number = 0;

  startDate: string;
  endDate: string;

  constructor(
    private notifier: NotifierService,
    private reportService: ReportService
  ){

  }

  ngOnInit(){
    var currDate = new Date();
    var startDate = `${currDate.getFullYear()}/${currDate.getMonth()+1}/${currDate.getDate()}`;
    var endDate = new Date(new Date().setDate(currDate.getDate() + 1));
    this.getTransactionReport(
      startDate,
      `${endDate.getFullYear()}/${endDate.getMonth()+1}/${endDate.getDate()}`      
    );
  }

  getTransactionReport(startDate: string, endDate: string){
    this.reportService.getTransactionReport(startDate, endDate, this.limit, this.offset).subscribe(results=>{
      this.transactions = this.transactions.concat(results);
      this.offset = this.transactions.length;
      
      if(results.length < this.limit){
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