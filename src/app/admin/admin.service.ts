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

  listSaleEntries(storeId, page, limit):Observable<any>{
    return this.http.get<any>(`${this.adminUrl}/listSaleEntries?storeId=${storeId}&page=${page}&limit=${limit}`)
    .pipe(
        catchError(this.handleError('List Sale Entries', null))); 
  }

  updateSaleStatus(saleId, newStatus){
    if(newStatus==="F" || newStatus==="P"){
      return this.http.get<any>(this.adminUrl+"/processCompletedSales")
      .pipe(
          catchError(this.handleError('Update sale status', null)));  
    }else{
      return this.http.put<any>(this.adminUrl+"/updateSaleStatus", {id: saleId, status: newStatus})
      .pipe(
          catchError(this.handleError('Update sale status', null)));
    }
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