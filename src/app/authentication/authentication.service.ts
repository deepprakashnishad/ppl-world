import { Injectable, Inject } from '@angular/core';
import { environment } from './../../environments/environment';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { retry, catchError, map, tap } from 'rxjs/operators';
import {AuthResponse} from './auth-response';
import { Router } from '@angular/router';
import { AuthInterceptorSkipHeader } from '../http-interceptors/auth-interceptor';
import { NotifierService } from 'angular-notifier';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    AuthInterceptorSkipHeader:''    
  })
};

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  redirectUrl: string;
  loginUrl: string;
  signupUrl: string;
  private requestPasswordResetCodeUrl: string;
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
  	private http: HttpClient,
    private router: Router,
    private notifier: NotifierService
  ) {
  	this.loginUrl = environment.baseurl+'/UserLogin/login';
    this.signupUrl = environment.baseurl + '/UserLogin';
    this.requestPasswordResetCodeUrl = environment.baseurl + '/UserLogin/resetPassword';
    if(this.getTokenOrOtherStoredData("isLoggedIn")){
      this.isLoggedIn.next(true);
    }
  }

  authorizeUser(accessListReqd: string[]):boolean{
      if (this.getTokenOrOtherStoredData()){
        if(accessListReqd===undefined || accessListReqd.length == 0){
          return true;
        }
        let permissionList:string = this.getTokenOrOtherStoredData('permissions')
        if(permissionList === undefined){
          return false;
        }

        let allowedPermissionList = permissionList.split(',')
          return accessListReqd.every((ele)=> 
          {  
            return allowedPermissionList.indexOf(ele) >=0 
          }
        )
      }else{
        return false;
      }
  }

  getTokenOrOtherStoredData(key='token') {
    if (sessionStorage.getItem(key)) {
      return sessionStorage.getItem(key);
    } else if (localStorage.getItem(key)) {
      let data = {
        token  : localStorage.getItem('token'),
        name : localStorage.getItem('name'),
        mobile : localStorage.getItem('mobile'),
        email : localStorage.getItem('email'),
        role : localStorage.getItem('role'),
        permissions : localStorage.getItem('permissions')
      }
      this.storeLocalData(data, "SESSION_STORAGE")
      return localStorage.getItem(key);
    } else {
      return '';
    }
  }

  signup(registrationData): Observable<AuthResponse> {
  	const mRegistrationData = {
  		n: registrationData.name,
  		m: registrationData.mobile,
  		e: registrationData.email,
  		password: registrationData.password,
      p: registrationData.parent.id
  	};
  	return this.http.post<AuthResponse>(
  		this.signupUrl, mRegistrationData, httpOptions)
  		.pipe(
  			retry(0),
  			catchError(this.handleError('registration', null))
  		);
  }

  login(credentials): Observable<AuthResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa(credentials.username + ':' + credentials.password),
        AuthInterceptorSkipHeader:''
      })
    };

  	return this.http.post<AuthResponse>(
  		this.loginUrl, null, httpOptions)
  		.pipe(
  			retry(0),
  			catchError(this.handleError('login', null))
  		);
  }

  requestPasswordResetCode(username) {
    return this.http.post(this.requestPasswordResetCodeUrl, { "username": username})
      .pipe(
        retry(2),
        catchError(this.handleError('login', null))
      );
  }

  resetPassword(username, password, otp) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(otp + ':' + password),
        AuthInterceptorSkipHeader: ''
      })
    };

    return this.http.post<AuthResponse>(
      this.signupUrl + "/updatePasswordWithResetCode", { "username": username }, httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError('Reset Password', null))
      );
  }

  resetPasswordWithOldPassword(oldPassword, newPassword) {

    return this.http.patch<any>(
      this.signupUrl + "/updatePasswordWithOldPassword", {
        "oldPassword": oldPassword,
        "newPassword": newPassword
      })
      .pipe(
        retry(0),
        catchError(this.handleErrorNormally('Reset Password', null))
      );
  }

  logout(): void{
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
    this.isLoggedIn.next(false);
  }

  storeLocalData(data: any, storageType): void {
    if (storageType === "LOCAL_STORAGE") {
      localStorage.setItem('token', data.token, );
      if(data.fbToken){
        sessionStorage.setItem('fbToken', data.fbToken);
      }
      localStorage.setItem('name', data.n);
      localStorage.setItem('mobile', data.m);
      localStorage.setItem('email', data.e);
      localStorage.setItem('role', data.r);
      localStorage.setItem('permissions', data.permissions);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('id', data.id);
      localStorage.setItem('iprr', data.iprr);
    } else {
      sessionStorage.setItem('token', data.token, );
      if(data.fbToken){
        sessionStorage.setItem('fbToken', data.fbToken);
      }
      sessionStorage.setItem('name', data.n);
      sessionStorage.setItem('mobile', data.m);
      sessionStorage.setItem('email', data.e);
      sessionStorage.setItem('role', data.r);
      sessionStorage.setItem('permissions', data.permissions);
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('id', data.id);
      sessionStorage.setItem('iprr', data.iprr);
    }
    this.isLoggedIn.next(true);
  }

  patchStoredData(data: any):void{
    Object.keys(data).forEach((key)=>{
      if(localStorage.getItem(key)){
        localStorage.setItem(key, data[key]);
      }
      if(sessionStorage.getItem(key)){
        sessionStorage.setItem(key, data[key]);
      }
    });
  }

  requestOTP(mobile, recaptchaToken): Observable<any> {
    return this.http.post(`${environment.baseurl}/OTP/requestOTP`, {
      type: "mobile",
      "token": recaptchaToken,
      "mobile": mobile
    });
  }

  verifyOTPAndSignIn(mobile, otp): Observable<AuthResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(mobile + ':' + otp),
        AuthInterceptorSkipHeader: ''
      })
    };

    return this.http.post<AuthResponse>(`${environment.baseurl}/OTP/verifyOTPAndSignIn`, {
      type: "mobile"
    }, httpOptions);
  }

  handleForbiddenRequest(error){
    this.redirectUrl = this.router.url
    this.router.navigate(['/login', {'error':[error.error.msg]}])
    localStorage.clear();
    sessionStorage.clear();
    this.isLoggedIn.next(false);
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Let the app keep running by returning an empty result.
      if(error instanceof HttpErrorResponse && error.status === 403){
        this.redirectUrl = this.router.url
        this.router.navigate(['/login', {'error':[error.error.msg]}])
        localStorage.clear();
        sessionStorage.clear();
        this.isLoggedIn.next(false);
      }else if(error instanceof HttpErrorResponse && error.status === 500){
        this.notifier.notify("error", error.error.msg);
        this.notifier.notify("error", "Server error. Please contact developer");
        return throwError(error);
      }else if (error instanceof ErrorEvent) {
    		return throwError('Unable to submit request. Please check your internet connection.');
    	} else {
    		return throwError(error);
    	}
    };
  }

  handleErrorNormally<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Let the app keep running by returning an empty result.
      if(error instanceof HttpErrorResponse && error.status === 403){
        this.notifier.notify("error", "Permission denied");
      }else if(error instanceof HttpErrorResponse && error.status === 500){
        this.notifier.notify("error", error.error.msg);
        this.notifier.notify("error", "Server error. Please contact developer");
        return throwError(error);
      }else if (error instanceof ErrorEvent) {
        return throwError('Unable to submit request. Please check your internet connection.');
      } else {
        return throwError(error);
      }
    };
  }
}
