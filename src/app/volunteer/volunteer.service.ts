import { Injectable, Inject } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {

  private volunteerUrl:string;

  constructor(
    private http: HttpClient, 
    private notifier: NotifierService
  ){
    this.volunteerUrl = environment.baseurl+'/Volunteer'; 
  }
  

  getDonors(): Observable<Person> {
    return this.http.get<Person>(this.volunteerUrl+"/getDonors")
      .pipe(
        catchError(this.handleError('Get Donors', null)));
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