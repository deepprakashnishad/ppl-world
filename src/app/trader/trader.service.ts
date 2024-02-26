import { Injectable, Inject } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { Person } from  './../person/person';

@Injectable({
  providedIn: 'root'
})
export class TraderService {

  private orderUrl: string;
  private portfolioUrl: string;
  private entityUrl: string;

  constructor(
    private http: HttpClient, 
    private notifier: NotifierService
  ){
    this.portfolioUrl = environment.baseurl+'/Portfolio';  
    this.entityUrl = environment.baseurl+'/Entity';
    this.orderUrl = environment.baseurl+'/Order';  
  }
  

  getEntity(entityId: string): Observable<any> {
    if(!entityId){
      entityId = "DS";
    }
    return this.http.get<any>(`${this.entityUrl}?id=${entityId}`)
      .pipe(
        catchError(this.handleError('Get Entity', null)));
  }

  getMarketDepth(entityId: string){
    return this.http.get<any>(`${this.orderUrl}/getMarketDepth/${entityId}`)
      .pipe(
        catchError(this.handleError('Get Entity', null)));
  }

  placeOrder(price: number, entity: string, side: string, qty: number): Observable<any> {
    return this.http.post<any>(`${this.orderUrl}`, {
      "price": price,
      "eid": entity,
      "side": side,
      "qty": qty
    }).pipe(
        catchError(this.handleError('Place Order', null)));
  }

  getPortfolio(): Observable<any>{
    return this.http.get<any>(`${this.portfolioUrl}`)
      .pipe(
        catchError(this.handleError('Get Portfolio', null)));
  }

  getOrders(startDate, endDate, limit, offset): Observable<any>{
    return this.http.get<any>(`${this.orderUrl}?start=${startDate}&end=${endDate}&limit=${limit}&offset=${offset}`)
      .pipe(
        catchError(this.handleError('Get Orders', null)));
  }

  initialize(): Observable<any>{
    return this.http.post<any>(`${this.portfolioUrl}/initializePortfolio`, {})
      .pipe(
        catchError(this.handleError('Initialize Portfolio', null)));
  }

  transactMoney(amount, withdrawFromTradingAcc: boolean){
    return this.http.post<any>(`${this.portfolioUrl}/transactMoney`, {
      amt: amount,
      isWithdrawlFromTradingAcc: withdrawFromTradingAcc
    })
    .pipe(
      catchError(this.handleError('Initialize Portfolio', null)));
  }

  executeOrdersInBackground(entity): Observable<any>{
    /*return this.http.get<any>(`${this.orderUrl}/executeOrdersInBackground`})
    .pipe(
        catchError(this.handleError('Place Order', null)));*/

    return this.http.get<any>(`${this.orderUrl}/executeOrdersInBackground/${entity}`)
      .pipe(
        catchError(this.handleError('Execute trades in background', null)));
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