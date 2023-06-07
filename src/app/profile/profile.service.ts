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
export class ProfileService {

  private personUrl:string;

  constructor(
    private http: HttpClient, 
    private notifier: NotifierService
  ){
    this.personUrl = environment.baseurl+'/Person';  
  }
  

  getPersonDetail(): Observable<Person> {
    return this.http.get<Person>(this.personUrl+"/getUserDetail")
      .pipe(
        catchError(this.handleError('Get Token', null)));
  }

  approveNewJoinee(newJoineeId, amount): Observable<any>{
    return this.http.post<Person>(this.personUrl+"/approveNewJoinee", 
      {"newJoineeId": newJoineeId, "amount": amount})
      .pipe(
        catchError(this.handleError('Approve New Joinee', null))); 
  }

  updateProfileImages(data, field): Observable<any>{
    return this.http.post<any>(this.personUrl+"/updateProfileImages", 
      {
        "field": field, 
        "data": data
      })
      .pipe(
        catchError(this.handleError('Approve New Joinee', null)));  
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