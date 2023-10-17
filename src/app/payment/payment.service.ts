import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Payment } from './payment';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  paymentUrl: string;
  pincodeTranslationUrl: string;

  constructor(
  	private http: HttpClient,
  ) {
     this.paymentUrl = environment.baseurl+'/payment';
  }

  add(data): Observable<Payment>{
    console.log(data);
    return this.http.post<Payment>(this.paymentUrl, data)
    .pipe(
        catchError(this.handleError('Add payment', null)));
  }

  createDummyOrder(poid, amount): Observable<Payment>{
    return this.http.post<Payment>(this.paymentUrl+"/createDummyOrder", {
      "poid": poid,
      "amount": amount
    })
    .pipe(
        catchError(this.handleError('Add payment', null)));
  }

  checkOrderPayment( order_id, payment_id, transaction_id, pg_order_id, channel): Observable<any> {
  	return this.http.get<any>(`${this.paymentUrl}/checkPayment?order_id=${order_id}&payment_id=${payment_id}&transaction_id=${transaction_id}&pg_order_id=${pg_order_id}&channel=${channel}`)
  		.pipe(
  			catchError(this.handleError('Get order list', null)));
  }

  verifyRazorpayPayment(data): Observable<any> {
  	return this.http.post<any>(`${this.paymentUrl}/verifyRazorpayPayment`, data)
  		.pipe(
  			catchError(this.handleError('Verify Razorpay payment', null)));
  }

  verifyRazorpayPaymentFromAllPayServer(data): Observable<any> {
    return this.http.post<any>(`${environment.allpayurl}/payment/verifyRazorpayPayment`, data)
      .pipe(
        catchError(this.handleError('Verify Razorpay payment', null)));
  }

  postTransactionToAllPayServer(data): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + environment.mtoken,
        AuthInterceptorSkipHeader:''
      })
    };
    return this.http.post<any>(`${environment.allpayurl}/transaction`, data, httpOptions)
      .pipe(
        catchError(this.handleError('Create Transaction', null)));
  }

  retryPayment(data): Observable<any> {
    return this.http.post<any>(`${this.paymentUrl}/retryPayment`, data)
    .pipe(
       catchError(this.handleError('Retry Payment', null)));
  }

  donateFromGAAcc(cid, amount, isAnonymous, campaignTitle): Observable<any>{
    return this.http.post<any>(`${this.paymentUrl}/donateFromGA`,
      {
        "ctitle": campaignTitle,
        "cid": cid,
        "amount": amount,
        "anonymous": isAnonymous
      }
    )
    .pipe(
       catchError(this.handleError('Retry Payment', null))); 
  }

  collectDonationFromOthers(campaignId, campaignTitle, amount, isAnonymous, donor, modeOfPayment, paymentDetails): Observable<any>{
    return this.http.post<any>(`${this.paymentUrl}/collectDonationOnBehalf`,
      {
        d: donor,
        amt: amount,
        cid: campaignId,
        ct: campaignTitle,
        anonymous: isAnonymous,
        mop: modeOfPayment,
        pd: paymentDetails
      }
    )
    .pipe(
       catchError(this.handleError('Retry Payment', null)));  
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
