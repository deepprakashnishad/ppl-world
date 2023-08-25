import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
  

@Injectable({
  providedIn: 'root'
})
export class MarriageService {
  marriageUrl: string;

  constructor(
  	private http: HttpClient,
  ) {
     this.marriageUrl = environment.baseurl+'/marriage';
  }

  listProfiles():Observable<any>{
    return this.http.get<any>(`${this.marriageUrl}/list`)
    .pipe(
        catchError(this.handleError('List Profile', null))); 
  }

  listMyProfiles():Observable<any>{
    return this.http.get<any>(`${this.marriageUrl}/listMyProfiles`)
    .pipe(
        catchError(this.handleError('List Profile', null))); 
  }

  getProfileDetail(id: string): Observable<any>{
    return this.http.get<any>(`${this.marriageUrl}?id=${id}`)
    .pipe(
        catchError(this.handleError('List Profile', null))); 
  }

  updateProfile(data:any){
    return this.http.patch<any>(this.marriageUrl, data)
    .pipe(
        catchError(this.handleError('Update profile', null))); 
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