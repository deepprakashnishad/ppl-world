import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoaderService } from './../shared/progress-spinner/loader.service';
import {IsBackgroundRequestHeader} from 'src/app/my-constants';

@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.headers.has(IsBackgroundRequestHeader)){
      console.log("Background request.");
      const headers = req.headers.delete(IsBackgroundRequestHeader);
      return next.handle(req.clone({ headers }));
    }

    this.showLoader();  
    return next.handle(req).pipe(tap((event: HttpEvent<any>) => { 
      if (event instanceof HttpResponse) {
        this.onEnd();
      }
    },
      (err: any) => {
        this.onEnd();
    }));
  }

  private onEnd(): void {
    this.hideLoader();
  }

  private showLoader(): void {
    this.loaderService.show();
  }
  
  private hideLoader(): void {
    this.loaderService.hide();
  }
}