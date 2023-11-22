import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import {AppRoutingModule} from './app-routing.module';
import { AuthenticationModule } from './authentication/authentication.module';
import {SharedModule} from './shared/shared.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import {AngularFireAuth} from '@angular/fire/auth';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AppComponent } from './app.component';
import { httpInterceptorProviders } from './http-interceptors/index';
import { NavigationComponent } from './navigation/navigation.component';
import { environment } from '../environments/environment';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { AdminModule } from './admin/admin.module';
import { PersonModule } from './person/person.module';
// import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
// import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { Navigation } from 'swiper';
import { SwiperModule } from 'swiper/angular';
import { ServiceWorkerModule } from '@angular/service-worker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './static-page/about-us/about-us.component';
import { ProfileComponent } from './profile/profile.component';
import { GuideComponent } from './profile/guide/guide.component';
import { FaqComponent } from './static-page/faq/faq.component';
import { ContactUsComponent } from './static-page/contact-us/contact-us.component';
import { CampaignComponent } from './static-page/campaign/campaign.component';
import { BeneficiaryComponent } from './static-page/campaign/beneficiary/beneficiary.component';
import { BeneficiaryEditorComponent } from './static-page/campaign/beneficiary/beneficiary-editor/beneficiary-editor.component';
import { PrivacyComponent } from './static-page/privacy/privacy.component';
import { TNCComponent } from './static-page/tnc/tnc.component';
import { CreateCampaignComponent } from './static-page/campaign/create-campaign/create-campaign.component';
import { DailyReportComponent } from './reports/daily-report/daily-report.component';
import { TransactionReportComponent } from './reports/transaction-report/transaction-report.component';
import { GlobalEarningReportComponent } from './reports/global-earning-report/global-earning-report.component';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { ViewCampaignComponent } from './static-page/campaign/view-campaign/view-campaign.component';
import { WallOfFameComponent } from './static-page/campaign/wall-of-fame/wall-of-fame.component';
import { SubscriptionComponent } from './static-page/campaign/subscription/subscription.component';
import { ServiceOfferEditorComponent } from './employment/service-offer/service-offer-editor/service-offer-editor.component';
import { ServiceDetailFormComponent } from './employment/service-offer/service-offer-editor/service-detail-form/service-detail-form.component';
import { ServiceReqdEditorComponent } from './employment/service-reqd/service-reqd-editor/service-reqd-editor.component';
import { ServiceCategoryEditorComponent } from './employment/category/service-category-editor.component';
import { CollectDonationFromOthersComponent } from './static-page/campaign/collect-donation-from-others/collect-donation-from-others.component';

import { ProfileEditorComponent } from './marriage/profile-editor/profile-editor.component';
import { FamilyDetailComponent } from './marriage/family-detail/family-detail.component';
import { ViewFamilyDetailsComponent } from './marriage/view-family-details/view-family-details.component';
import { ProfileListComponent } from './marriage/profile-list/profile-list.component';
import { ProfileViewerComponent } from './marriage/profile-viewer/profile-viewer.component';
import { CasteSearchComponent } from './marriage/caste/caste-search.component';
import { StoreComponent } from './static-page/store/store.component';
import {APP_BASE_HREF} from '@angular/common';

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
    PrivacyComponent,
    TNCComponent,
    CampaignComponent,
    CreateCampaignComponent,
    BeneficiaryComponent,
    BeneficiaryEditorComponent,
    ViewCampaignComponent,
    WallOfFameComponent,
    SubscriptionComponent,
    DailyReportComponent,
    TransactionReportComponent,
    GlobalEarningReportComponent,
    ServiceOfferEditorComponent,
    ServiceDetailFormComponent,
    ServiceReqdEditorComponent,
    ProfileEditorComponent,
    ProfileListComponent,
    FamilyDetailComponent,
    ViewFamilyDetailsComponent,
    ProfileViewerComponent,
    CasteSearchComponent,
    ServiceCategoryEditorComponent,
    CollectDonationFromOthersComponent,
    StoreComponent,
    GuideComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,    
    AuthenticationModule,
    NotifierModule.withConfig(notifierDefaultOptions),
    AppRoutingModule,
    AdminModule,
    PersonModule,
    SharedModule,
    NgxMaterialTimepickerModule,
    // ShareButtonsModule,
    // ShareIconsModule,
    // QuillModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase, environment.firebase.projectId),
    AngularFireMessagingModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,    
    ServiceWorkerModule.register('combined-sw.js', {
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
