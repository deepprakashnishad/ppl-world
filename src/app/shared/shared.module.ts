import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from './../material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AgmCoreModule } from '@agm/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import {HttpClientModule, HttpClient } from '@angular/common/http';


import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner/progress-spinner.component';
import { AssignRevokePermissionsComponent } from '../admin/permission/assign-revoke-permissions/assign-revoke-permissions.component';
import { AddEditPermissionComponent } from '../admin/permission/add-edit-permission/add-edit-permission.component';
import { ViewPermissionComponent } from '../admin/permission/view-permission/view-permission.component';
import { FileUploadModule } from 'ng2-file-upload';
import { CapitalizeFirstLetterDirective } from '../directives/capitalize-first-letter.directive';
import { CapitalizeDirective } from '../directives/capitalize.directive';
import { MyFilterPipe } from './pipes/my-filter.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { GetTagByIdPipe } from './pipes/get-tag-by-id.pipe';
import { FirestorageUploaderComponent } from './firestorage-uploader/firestorage-uploader.component';
import { UploaderComponent } from './uploader/uploader.component';
import { CarouselComponent } from './carousel/carousel.component';
import { AutocompleteWithAddComponent } from './autocomplete-with-add/autocomplete-with-add.component';
import { TagAutocompleteComponent } from './tag-autocomplete/tag-autocomplete.component';
import { TagEditorComponent } from './tag-autocomplete/tag-editor/tag-editor.component';
import { TagChipInputComponent } from './tag-chip-input/tag-chip-input.component';
import { ShareComponent } from './share/share.component';
import { DropzoneDirective } from './uploader/dropzone.directive';
import { NotifierModule } from 'angular-notifier';
// import { PersonModule } from '../person/person.module';
import { PaymentModule } from '../payment/payment.module';
import { PaymentComponent } from '../payment/payment.component';
import { LazyImgDirective } from '../directives/lazy-img.directive';
import { AddressCardComponent } from './address/address-card/address-card.component';
import { AddEditAddressComponent } from './address/add-edit-address/add-edit-address.component';
import { AddressComponent } from './address/address.component';
import {MyGoogleMapComponent} from './my-google-maps/my-google-maps.component';
import {LocationCoordinatesComponent} from './my-google-maps/location-coordinates/location-coordinates.component';

import { environment } from '../../environments/environment';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new MultiTranslateHttpLoader(httpClient, [
      {prefix: "./assets/translate/core/", suffix: ".json"},
      {prefix: "./assets/translate/shared/", suffix: ".json"},
  ]);
}

@NgModule({
  declarations: [
    ConfirmDialogComponent, 
    ProgressSpinnerComponent, 
    AssignRevokePermissionsComponent, 
    AddEditPermissionComponent, 
    ViewPermissionComponent, 
    CapitalizeFirstLetterDirective, 
    CapitalizeDirective, 
    DropzoneDirective,
    LazyImgDirective,
    MyFilterPipe, 
    SafeHtmlPipe, 
    SafeUrlPipe,
    GetTagByIdPipe,
    FirestorageUploaderComponent,
    UploaderComponent,
    CarouselComponent,
    ShareComponent,
    AutocompleteWithAddComponent,
    AddressCardComponent,
    AddEditAddressComponent,
    AddressComponent,
    MyGoogleMapComponent,
    LocationCoordinatesComponent,
    TagChipInputComponent,
    TagAutocompleteComponent,
    TagEditorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FileUploadModule,
    FormsModule,
    HttpClientModule,
    // PersonModule,
    PaymentModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBpqNa1E6nugGw6KMUU9YkXP49O2W1vDUEs",
      libraries: ['places']
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports:[
  	ConfirmDialogComponent, 
  	ProgressSpinnerComponent, 
  	FormsModule,
  	ReactiveFormsModule,
  	FlexLayoutModule, 
  	MaterialModule,
  	CommonModule,
    // PersonModule,
    FileUploadModule,
    TranslateModule,
  	AssignRevokePermissionsComponent,
  	AddEditPermissionComponent,
  	ViewPermissionComponent,
  	CapitalizeFirstLetterDirective,
  	CapitalizeDirective,
  	MyFilterPipe,
  	SafeHtmlPipe,
  	SafeUrlPipe,
    GetTagByIdPipe,
    FirestorageUploaderComponent,
    UploaderComponent,
    CarouselComponent,
    PaymentComponent,
    ShareComponent,
    AddressCardComponent,
    AddEditAddressComponent,
    AddressComponent,
    AutocompleteWithAddComponent,
    MyGoogleMapComponent,
    LocationCoordinatesComponent,
    TagChipInputComponent,
    TagAutocompleteComponent,
    TagEditorComponent
  ],
  entryComponents:[AddEditPermissionComponent, ConfirmDialogComponent, TagEditorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
