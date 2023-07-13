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
  selector: 'app-global-earning-report',
  templateUrl: './global-earning-report.component.html',
  styleUrls: ['./global-earning-report.component.scss']
})
export class GlobalEarningReportComponent implements OnInit {

  rangeForm = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });

  globalEarnings: Array<any> = [];

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
    this.getGlobalEarningReport(
      startDate,
      `${endDate.getFullYear()}/${endDate.getMonth()+1}/${endDate.getDate()}`      
    );
  }

  getGlobalEarningReport(startDate: string, endDate: string){
    this.reportService.getGlobalEarningReport(startDate, endDate, this.limit, this.offset).subscribe(result=>{
      console.log(result);
      var pf = result['pf'];
      var pfd = result['pfd'];
      var jd = result['joining_date'];
      var geRecords = result['geRecords'];

      if(geRecords.length < this.limit){
        this.isEndReached = true;
      }

      for(var i=0; i < geRecords.length; i++){
        if(geRecords[i]['mTimestamp'] > jd){
          break;
        }
        this.formatRecord(geRecords[i], undefined);
      }

      for(; i < geRecords.length; i++){
        if(pfd && pfd['g'] && geRecords[i]['ged']['timestamp'] < pfd['g']){
          break;
        }
        this.formatRecord(geRecords[i], "s");
      }

      for(; i < geRecords.length; i++){
        if(pfd && pfd['g'] && geRecords[i]['ged']['timestamp'] < pfd['g']){
          break;
        }
        this.formatRecord(geRecords[i], "g");
      }

      for(; i < geRecords.length; i++){
        if(pfd && pfd['g'] && geRecords[i]['ged']['timestamp'] < pfd['g']){
          break;
        }
        this.formatRecord(geRecords[i], "d");
      }

      for(; i < geRecords.length; i++){
        if(pfd && pfd['g'] && geRecords[i]['ged']['timestamp'] < pfd['g']){
          break;
        }
        this.formatRecord(geRecords[i], "p");
      }

      this.offset = this.globalEarnings.length;
    });
  }

  private formatRecord(record: any, pf: string){
    var newRecs = [];
    console.log(record);
    var temp = {};
    temp['tc'] = record['tc'];
    temp['ged'] = record['ged'];
    temp['bdc'] = record['dc'];
    temp['dpd'] = record['dpd'];
    temp['dad'] = record['dad'];
    temp['s'] = record['ds'];
    temp['upf'] = pf; //User Platform
    if(record['dad'] && pf){
      temp['ar'] = record['dad'][pf];
    }
    this.globalEarnings.push(temp);
  }

  refresh(){
    this.offset = 0;
    this.isEndReached = false;

    this.startDate = this.rangeForm.value.start;
    this.endDate = this.rangeForm.value.end;
    
    this.getGlobalEarningReport(this.startDate, this.endDate)
  }
}