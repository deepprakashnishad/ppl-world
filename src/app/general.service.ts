import { Injectable, Inject } from '@angular/core';
import { environment } from './../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private genericUrl:string;
  private tagUrl: string;

  selectedLanguage: BehaviorSubject<string> = new BehaviorSubject<string>("en");

  constructor(
    private http: HttpClient, 
    private notifier: NotifierService,
  ){
    this.genericUrl = environment.baseurl+'/generic';  
    this.tagUrl = environment.baseurl+'/tag';  
  }

  updateLanguage(selectedLang){
    if(selectedLang.mValue){
      this.selectedLanguage.next(selectedLang.mValue);
    }
  }

  getLanguage(){
    var selectedLang = localStorage.getItem("selectedLang");
    if(selectedLang){
      selectedLang = JSON.parse(selectedLang)["mValue"];
    }else{
      selectedLang = environment.defaultLang;
    }

    return selectedLang;

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

  getTags(key): Observable<any> {
    return this.http.get<any>(`${this.tagUrl}?key=${key}`)
      .pipe(
        catchError(this.handleError('List tags', null)));
  }

  updateTag(key, tagId, newTag, lang): Observable<any> {
   return this.http.patch<any>(this.tagUrl, 
   {
    "key": key,
    "tagId": tagId,
    "newTag": newTag,
    "lang": lang
   })
      .pipe(
        catchError(this.handleError('Update tags', null))); 
  }

  getRecentlyUpdatedTags(lastTimestamp){
    return this.http.get<any>(`${this.tagUrl}/getRecentlyUpdatedTags?lastTimestamp=${lastTimestamp}`)
      .pipe(
        catchError(this.handleError('Newly updated tags', null)));
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