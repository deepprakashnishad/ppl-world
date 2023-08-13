import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
  

@Injectable({
  providedIn: 'root'
})
export class EmploymentService {
  categoryUrl: string;
  employmentUrl: string;
  serviceRequirementUrl: string;

  constructor(
  	private http: HttpClient,
  ) {
     this.categoryUrl = environment.baseurl+'/category';
     this.employmentUrl = environment.baseurl+'/employment';
     this.serviceRequirementUrl = environment.baseurl+'/serviceRequirement';
  }

  addCategory(data): Observable<any>{
    return this.http.post<any>(this.categoryUrl, data)
    .pipe(
        catchError(this.handleError('Add category', null)));
  }

  listCategory():Observable<any>{
    return this.http.get<any>(this.categoryUrl)
    .pipe(
        catchError(this.handleError('List Category', null))); 
  }

  updatePersonWork(key, data:any){
    return this.http.patch<any>(this.employmentUrl, {
      "key": key,
      "data": data
    })
    .pipe(
        catchError(this.handleError('Update person work', null))); 
  }

  getPersonWork(key?: string){
    var url = this.employmentUrl;
    if(key){
      url = `${this.employmentUrl}?key=${key}`;
    }
    return this.http.get<any>(url)
    .pipe(
        catchError(this.handleError('Get person work', null)));  
  }

  deleteWork(key: string, personId?: string){
    var url = `${this.employmentUrl}?key=${key}`;
    if(personId){
      url = `${this.employmentUrl}?key=${key}&personId=${personId}`;
    }
    return this.http.delete<any>(url)
    .pipe(
        catchError(this.handleError('Delete person work', null)));  
  }

  createServiceRequirement(data){
    return this.http.post<any>(this.serviceRequirementUrl, data)
    .pipe(
        catchError(this.handleError('Add service requirement', null))); 
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