import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'
import { SwUpdate } from '@angular/service-worker';
import { PwaService } from './pwa.service';
import { GeneralService } from './general.service';
import { AuthenticationService } from './authentication/authentication.service';
import { StorageService } from './storage.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { map, mergeMap, startWith, mergeMapTo } from 'rxjs/operators';
import { MyIdbService, TAG } from './my-idb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'shop-manager';
  isShowNavigation = true;
  pwa: PwaService;
  isLoggedIn: boolean;

  constructor(
    private router: Router,
    private pwaService: PwaService,
    private afMessaging: AngularFireMessaging,
    private generalService: GeneralService,
    private idbService: MyIdbService,
    private authenticationService: AuthenticationService,
    private storageService: StorageService
  ) {
    this.pwa = this.pwaService;
  }

  ngOnInit() {

    this.authenticationService.isLoggedIn.subscribe(value => {
      this.isLoggedIn = value;
    });

    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {          
         if (this.router.url.includes('admin')) {
            this.isShowNavigation = false;
         }
         else {
          this.isShowNavigation = true;
         }
        }
      }
    );
    this.updateLocalTags();
    // this.requestPermission();
  }

  installPwa(): void {
    this.pwaService.promptEvent.prompt();
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  scrollToTopFunc(event) {
    var scrollElem= document.querySelector('#moveTop');
    console.log(scrollElem);
    scrollElem.scrollIntoView({ behavior: "smooth"});
  }

  listen() {
    this.afMessaging.messages
      .subscribe((message) => { console.log(message); });
  }

  updateLocalTags(){
    this.idbService.getValue(TAG, "lastTimestamp").then(lastTimestamp=>{
      if(!lastTimestamp){
        lastTimestamp = 0;
      }
      this.generalService.getRecentlyUpdatedTags(lastTimestamp, true).subscribe(result=>{
        var data = {};
        result.tags.forEach(ele=>{
          var tid = ele['tid'];
          delete ele['id'];
          delete ele['uat'];
          delete ele['tid']
          data[tid] = ele;
        });

        this.idbService.setValue(TAG, data).then(result1=>{
          this.idbService.setValue(TAG, {lastTimestamp: result['lastTimestamp']});
        });
        
      })  
    });
    
  }
}
