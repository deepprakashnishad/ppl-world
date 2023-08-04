import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { DummyPaymentComponent } from './dummy-payment/dummy-payment.component';
import { DonateFromGAComponent } from './donate-from-ga/donate-from-ga.component';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RazorpayButtonComponent } from './razorpay-payment-button/razorpay-payment-button.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule
  ],
  declarations: [
    PaymentComponent,
    RazorpayButtonComponent,
    DonateFromGAComponent,
    DummyPaymentComponent
  ],
  exports: [
    PaymentComponent, RazorpayButtonComponent, DummyPaymentComponent
  ]
})
export class PaymentModule { }
