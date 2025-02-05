import { Injectable, Inject } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private reportUrl:string;

  constructor(
    private http: HttpClient, 
    private notifier: NotifierService
  ){
    this.reportUrl = environment.baseurl+'/Report';  
  }
  

  getDailyReport(startDate: string, endDate: string): Observable<any> {
    if(!startDate){
      var currDate = new Date();
      startDate = `${currDate.getFullYear()}/${currDate.getMonth()+1}/${currDate.getDate()}`;
    }
    return this.http.get<any>(`${this.reportUrl}/daily-transaction-report?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`)
      .pipe(
        catchError(this.handleError('Get Daily Report', null)));
  }

  getGlobalEarningReport(startDate: string, endDate: string, limit: number, offset: number): Observable<any> {
    if(!startDate){
      var currDate = new Date();
      startDate = `${currDate.getFullYear()}/${currDate.getMonth()+1}/${currDate.getDate()}`;
    }
    return this.http.get<any>(`${this.reportUrl}/global-earning-report?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}&limit=${limit}&offset=${offset}`)
      .pipe(
        catchError(this.handleError('Get Global Earning Report', null)));
  }

  getTransactionReport(startDate: string, endDate: string, limit: number, offset: number): Observable<any> {
    if(!startDate){
      var currDate = new Date();
      startDate = `${currDate.getFullYear()}/${currDate.getMonth()+1}/${currDate.getDate()}`;
    }
    return this.http.get<any>(`${this.reportUrl}/transaction-report?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}&limit=${limit}&offset=${offset}`)
      .pipe(
        catchError(this.handleError('Get Daily Report', null)));
  }

  getSaleReport(startDate: string, endDate: string, limit: number, offset: number, reportType: string="downline-report"): Observable<any> {
    if(!startDate){
      var currDate = new Date();
      startDate = `${currDate.getFullYear()}/${currDate.getMonth()+1}/${currDate.getDate()}`;
    }
    if(reportType==="downline-report"){
      return this.http.get<any>(`${this.reportUrl}/sale-report?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}&limit=${limit}&offset=${offset}`)
      .pipe(
        catchError(this.handleError('Get Daily Report', null)));
    }else{
      return this.http.get<any>(`${this.reportUrl}/my-sale-report?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}&limit=${limit}&offset=${offset}`)
      .pipe(
        catchError(this.handleError('Get Daily Report', null)));
    }
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Let the app keep running by returning an empty result.
      if (error instanceof ErrorEvent) {
        return throwError('Unable to submit request. Please check your internet connection.');
      } else {
        if(error['msg']){
          this.notifier.notify("error", error['msg']);
        }
        return throwError(error);
      }
    };
  }
}