import { 
  Component, 
  OnInit, 
} from '@angular/core';
import {FormControl} from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ReportService } from './../report.service';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.scss']
})
export class DailyReportComponent implements OnInit {

  constructor(
    private notifier: NotifierService,
    private reportService: ReportService
  ){

  }

  ngOnInit(){
    var currDate = new Date();
    var startDate = `${currDate.getFullYear()}/${currDate.getMonth()+1}/${currDate.getDate()}`;
    var endDate = new Date(new Date().setDate(currDate.getDate() + 1));
    this.getDailyReport(
      startDate,
      `${endDate.getFullYear()}/${endDate.getMonth()+1}/${endDate.getDate()}`      
    );
  }

  getDailyReport(startDate: string, endDate: string){
    this.reportService.getDailyReport(startDate, endDate).subscribe(result=>{
      console.log(result);
    });
  }
}