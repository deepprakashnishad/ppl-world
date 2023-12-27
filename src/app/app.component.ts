import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'
import { SwUpdate } from '@angular/service-worker';
import { PwaService } from './pwa.service';
import { GeneralService } from './general.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthenticationService } from './authentication/authentication.service';
import { StorageService } from './storage.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { map, mergeMap, startWith, mergeMapTo } from 'rxjs/operators';
import { MyIdbService, TAG } from './my-idb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
  trigger('toggleMenu', [

    transition(':enter', [
      style({opacity: 0}),
      animate('500ms', style({opacity: 1}))
    ]),
    transition(':leave', [
        style({opacity: 1}),
        animate('500ms', style({opacity: 0}))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'shop-manager';
  isShowNavigation = true;
  pwa: PwaService;
  isLoggedIn: boolean;
  message: string = "";

  displayNotification = false;

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

    /*setInterval(()=>{
      this.displayNotification = !this.displayNotification;
    }, 5000);*/
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

    window.addEventListener('message', this.receiveMessage.bind(this), false);
    // this.requestPermission();
  }

  receiveMessage(event: MessageEvent) {
    if (event.origin !== 'http://localhost:1337' && event.origin !== 'https://ai-expert.onrender.com') {
      return;
    }

    // Do something with the message data
    console.log('Received message from iframe:', event.data);
  }

  installPwa(): void {
    this.pwaService.promptEvent.prompt();
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
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

  botResponded(event){
    console.log(event);
  }
}
