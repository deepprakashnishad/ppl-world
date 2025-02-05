import { Injectable, Inject } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { Campaign } from  './campaign';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  private campaignUrl:string;

  constructor(private http: HttpClient, private notifier: NotifierService){
    this.campaignUrl = environment.baseurl+'/campaign';  
  }

  postCampaign(campaign: Campaign){
    return this.http.post<Campaign>(this.campaignUrl, campaign)
      .pipe(
        catchError(this.handleError('Create Campaign', null)));
  }

  updateCampaign(campaign: Campaign){
    return this.http.patch<Campaign>(this.campaignUrl, campaign)
      .pipe(
        catchError(this.handleError('Update Campaign', null)));
  }
  
  getCampaignsByCategory(category: string): Observable<Array<Campaign>>{
    return this.http.get<Array<Campaign>>(this.campaignUrl+"?category="+category)
      .pipe(
        catchError(this.handleError('Get Token', null)));
  }

  getCampaignDetail(id: string): Observable<Campaign> {
    return this.http.get<Campaign>(this.campaignUrl+"/"+id)
      .pipe(
        catchError(this.handleError('Get Token', null)));
  }

  getSubscription(cid, amount, frequency, isAnonymous, startDate, inspiration): Observable<any>{
    return this.http.post<any>(`${this.campaignUrl}/getSubscription`, {
      "cid": cid,
      "amount": amount,
      "freq": frequency,
      "isAnonymous": isAnonymous,
      "startDate": startDate,
        "inspiration": inspiration
    })
      .pipe(
        catchError(this.handleError('Subscribe Campaign', null)));
  }
    
    subscribeDonor(cid, amount, frequency, isAnonymous, startDate, subscriptionFor): Observable<any>{
        return this.http.post<any>(`${environment.baseurl}/DonorSubscription/subscribeOtherPerson`, {
          "cid": cid,
          "amount": amount,
          "freq": frequency,
          "isAnonymous": isAnonymous,
          "startDate": startDate,
            "subscriberId": subscriptionFor
        })
          .pipe(
            catchError(this.handleError('Subscribe Campaign', null)));
    }

  getRegularDonors(limit:number = 50, offset:number = 0): Observable<any>{
    return this.http.get<any>(`${this.campaignUrl}/getRegularDonors?limit=${limit}&offset=${offset}`)
      .pipe(
        catchError(this.handleError('Subscribe Campaign', null))); 
  }

  updateBeneficiary(beneficiaryData: any, cid: string, chid?: string){
    return this.http.post<any>(`${this.campaignUrl}/updateBeneficiary`, {
      "beneficiary": beneficiaryData,
      "cid": cid,
      "chid": chid
    })
        .pipe(
        catchError(this.handleError('Update beneficiary', null))); 
  }

  getBeneficiaries(bids: any){
    return this.http.get<any>(`${this.campaignUrl}/getBeneficiaries?bids=${bids}`)
      .pipe(
        catchError(this.handleError('Get beneficiaries', null))); 
  }
    
  getBeneficiarySummary(cid: string, type: string = "campaign"){
    return this.http.get<any>(`${this.campaignUrl}/getBeneficiarySummary?cid=${cid}&type=${type}`)
      .pipe(
        catchError(this.handleError('Get beneficiaries', null))); 
  } 
    
  getCampaignDonors(campaignId: string, limit=50, offset=0){
    console.log(campaignId);
    return this.http.get<any>(`${this.campaignUrl}/getCampaignDonors?cid=${campaignId}&limit=${limit}&offset=${offset}`)
      .pipe(
        catchError(this.handleError('Get beneficiaries', null))); 
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