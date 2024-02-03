import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
  

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  adminUrl: string;

  constructor(
    private http: HttpClient,
  ) {
     this.adminUrl = environment.baseurl+'/admin';
  }

  addSaleEntry(data): Observable<any>{
    return this.http.post<any>(this.adminUrl+"/addSaleEntry", data)
    .pipe(
        catchError(this.handleError('Add Sale Entry', null)));
  }

  listSaleEntries(page, limit):Observable<any>{
    return this.http.get<any>(`${this.adminUrl}/listSaleEntries?page=${page}&limit=${limit}`)
    .pipe(
        catchError(this.handleError('List Sale Entries', null))); 
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