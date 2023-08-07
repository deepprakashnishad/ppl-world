import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from './../material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
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
import { FirestorageUploaderComponent } from './firestorage-uploader/firestorage-uploader.component';
import { UploaderComponent } from './uploader/uploader.component';
import { CarouselComponent } from './carousel/carousel.component';
import { AutocompleteWithAddComponent } from './autocomplete-with-add/autocomplete-with-add.component';
import { ShareComponent } from './share/share.component';
import { DropzoneDirective } from './uploader/dropzone.directive';
import { NotifierModule } from 'angular-notifier';
import { PersonModule } from '../person/person.module';
import { PaymentModule } from '../payment/payment.module';
import { PaymentComponent } from '../payment/payment.component';
import { LazyImgDirective } from '../directives/lazy-img.directive';

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
    FirestorageUploaderComponent,
    UploaderComponent,
    CarouselComponent,
    ShareComponent,
    AutocompleteWithAddComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FileUploadModule,
    FormsModule,
    PaymentModule,
    ReactiveFormsModule,
  ],
  exports:[
  	ConfirmDialogComponent, 
  	ProgressSpinnerComponent, 
  	FormsModule,
  	ReactiveFormsModule,
  	FlexLayoutModule, 
  	MaterialModule,
  	CommonModule,
    FileUploadModule,
  	AssignRevokePermissionsComponent,
  	AddEditPermissionComponent,
  	ViewPermissionComponent,
  	CapitalizeFirstLetterDirective,
  	CapitalizeDirective,
  	MyFilterPipe,
  	SafeHtmlPipe,
  	SafeUrlPipe,
    FirestorageUploaderComponent,
    UploaderComponent,
    CarouselComponent,
    PaymentComponent,
    ShareComponent,
    AutocompleteWithAddComponent
  ],
  entryComponents:[AddEditPermissionComponent, ConfirmDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
