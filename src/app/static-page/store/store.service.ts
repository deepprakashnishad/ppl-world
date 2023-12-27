import { Injectable, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject } from 'rxjs';
import { IsBackgroundRequestHeader } from 'src/app/my-constants';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

	storeUrl: string;

	constructor(
	  	private http: HttpClient,
	  	private notifier: NotifierService
	) {
		this.storeUrl = environment.baseurl+'/store';
	}

	saveLead(data){
		return this.http.post<any>(`${this.storeUrl}/lead`, data)
	    .pipe(
	        catchError(this.handleError('Add Lead', null))); 
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