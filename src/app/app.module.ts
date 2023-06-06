import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import {AppRoutingModule} from './app-routing.module';
import { AuthenticationModule } from './authentication/authentication.module';
import {SharedModule} from './shared/shared.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import {AngularFireAuth} from '@angular/fire/auth';
import { AppComponent } from './app.component';
import { httpInterceptorProviders } from './http-interceptors/index';
import { NavigationComponent } from './navigation/navigation.component';
import { environment } from '../environments/environment';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { AdminModule } from './admin/admin.module';
import { PersonModule } from './person/person.module';
import { Navigation } from 'swiper';
import { SwiperModule } from 'swiper/angular';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './static-page/about-us/about-us.component';
import { ProfileComponent } from './profile/profile.component';
import { FaqComponent } from './static-page/faq/faq.component';
import { ContactUsComponent } from './static-page/contact-us/contact-us.component';
import { CampaignComponent } from './static-page/campaign/campaign.component';
import { CreateCampaignComponent } from './static-page/campaign/create-campaign/create-campaign.component';

const notifierDefaultOptions: NotifierOptions = {
  position: {
      horizontal: {
          position: "right",
          distance: 12
      },
      vertical: {
          position: "bottom",
          distance: 12,
          gap: 10
      }
  },
  theme: "material",
  behaviour: {
      autoHide: 3000,
      onClick: false,
      onMouseover: "pauseAutoHide",
      showDismissButton: true,
      stacking: 4
  },
  animations: {
      enabled: true,
      show: {
          preset: "slide",
          speed: 300,
          easing: "ease"
      },
      hide: {
          preset: "fade",
          speed: 1000,
          easing: "ease",
      },
      shift: {
          speed: 300,
          easing: "ease"
      },
      overlap: 150
  }
};

@NgModule({
  declarations: [				
    AppComponent,
    HomeComponent,
    NavigationComponent,
    ProfileComponent,
    AboutUsComponent,
    FaqComponent,
    ContactUsComponent,
    CampaignComponent,
    CreateCampaignComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    AuthenticationModule,
    NotifierModule.withConfig(notifierDefaultOptions),
    AppRoutingModule,
    AdminModule,
    PersonModule,
    SharedModule,
    // QuillModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase, environment.firebase.projectId),
    AngularFireStorageModule,
    
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    httpInterceptorProviders, AngularFireAuth, 
    { provide: BUCKET, useValue: environment.firebase.storageBucket },
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
