import { Injectable, Inject } from '@angular/core';
import { environment } from './../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private genericUrl:string;

  constructor(private http: HttpClient, private notifier: NotifierService){
    this.genericUrl = environment.baseurl+'/generic';  
  }
  
  updateFirebaseMessagingToken(token: string): Observable<any>{
    return this.http.patch<any>(this.genericUrl+"/update-firebase-token", {token: token})
      .pipe(
        catchError(this.handleError('Save Contact Details', null)));
  }

  saveContactDetails(data: any): Observable<any> {
    return this.http.post<any>(this.genericUrl+"/submit-contact-details", data)
      .pipe(
        catchError(this.handleError('Save Contact Details', null)));
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