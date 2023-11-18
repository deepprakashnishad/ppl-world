import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { DummyPaymentComponent } from './dummy-payment/dummy-payment.component';
import { DonateFromGAComponent } from './donate-from-ga/donate-from-ga.component';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
// import { PersonModule } from  'src/app/person/person.module';
// import { SharedModule } from  'src/app/shared/shared.module';
import { RazorpayButtonComponent } from './razorpay-payment-button/razorpay-payment-button.component';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    // PersonModule
    // SharedModule
  ],
  declarations: [
    PaymentComponent,
    RazorpayButtonComponent,
    DonateFromGAComponent,
    DummyPaymentComponent,
    PaymentConfirmationComponent
  ],
  exports: [
    PaymentComponent, RazorpayButtonComponent, DummyPaymentComponent, PaymentConfirmationComponent
  ]
})
export class PaymentModule { }
