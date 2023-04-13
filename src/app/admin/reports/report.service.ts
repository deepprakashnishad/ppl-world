import { Injectable, Inject } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  reportUrl: string;

  constructor(
    private http: HttpClient,
    private notifier: NotifierService
  ) {
     this.reportUrl = environment.baseurl+'/report';
  }

  getOrdersByDate(startDate, endDate): Observable<Array<any>> {
    return this.http.get<any>(this.reportUrl+"/getOrdersByDate", {
      params: {
        "startDate": startDate,
        "endDate": endDate
      }
    })
      .pipe(
        catchError(this.handleError('Get Token', null)));
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Let the app keep running by returning an empty result.
      if (error instanceof ErrorEvent) {
        return throwError('Unable to submit request. Please check your internet connection.');
      } else {
        return throwError(error);
      }
    };
  }
}