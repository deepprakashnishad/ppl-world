import { Injectable, Inject } from '@angular/core';
import { environment } from './../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject } from 'rxjs';
import { IsBackgroundRequestHeader } from 'src/app/my-constants';

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
    if(selectedLang){
      this.selectedLanguage.next(selectedLang);
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

  calculatorAgeFromTimestamp(tsInMin){
    var currTS = new Date().getTime()/(60*1000);
    var ageInMin = currTS - tsInMin;

    var minInAYear = 525600;
    var minInAMonth = 43200;

    var years = Math.floor(ageInMin/minInAYear);
    var remainingMin = ageInMin%minInAYear;
    var months = Math.floor(remainingMin/minInAMonth);
    if(months>0){
      return `${years} Years ${months} Months`;
    }else{
      return `${years} Years`;
    }
  }

  formatDate(mDate: Date, format: string){
    var years = mDate.getFullYear();
    var months = mDate.getMonth()+1;
    var date = mDate.getDate();

    var formattedDate = format.replace("yyyy", years.toString())
                        .replace('mm', months.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}).toString())
                        .replace('dd', date.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}).toString());

    return formattedDate;
  }

  formatDateWithTimestamp(timestamp: number, format: string){
    return this.formatDate(new Date(timestamp), format);
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

  getRecentlyUpdatedTags(lastTimestamp, isBackgroundService: boolean = false){
    if(isBackgroundService){
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          IsBackgroundRequestHeader:''
        })
      };  
      return this.http.get<any>(
        `${this.tagUrl}/getRecentlyUpdatedTags?lastTimestamp=${lastTimestamp}`, httpOptions)
      .pipe(
        catchError(this.handleError('Newly updated tags', null)));
    }else{
      return this.http.get<any>(`${this.tagUrl}/getRecentlyUpdatedTags?lastTimestamp=${lastTimestamp}`)
      .pipe(
        catchError(this.handleError('Newly updated tags', null)));
    }
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