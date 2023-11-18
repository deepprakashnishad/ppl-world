import { Component, NgZone, OnInit, Input, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentService } from './../payment.service';

declare var Razorpay: any;

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.scss']
})
export class PaymentConfirmationComponent implements OnInit {

  readonly razorpay: string = "RAZORPAY";

  readonly phonepe: string = "PHONEPE";

  amount: number;

  merchantTransactionId: string;

  isPaymentSuccessful: number = 0;

  message1: string = "Please Wait...Payment Verification In Progress";

  message2: string = "Thank you for contribution towards society.";

  constructor(
    private paymentService: PaymentService,
    private activatedRoute: ActivatedRoute,
    private notifier: NotifierService,
    private router: Router
  ) { 
    this.activatedRoute.queryParams.subscribe(params=>{
      if(params['merchantTransactionId']){
        this.merchantTransactionId = params['merchantTransactionId'];  
        this.fetchPaymentStatus();
      }else{
        // this.router.navigate(['/']);
      }
    });
  }

  ngOnInit() {
    
  }

  fetchPaymentStatus(){
    this.paymentService.checkPhonepePaymentStatus(this.merchantTransactionId)
    .subscribe(result=>{
      if(result.success){
        this.notifier.notify("success", "Payment successfull");
        this.isPaymentSuccessful = 1;
        this.message1 = "Payment successfull";
        setTimeout(()=>{
          this.router.navigate(['/']);
          // window.location = environment.appUrl;
        }, 12000)
      }else{
        this.notifier.notify("error", "Payment failed. Please try again.");
        this.isPaymentSuccessful = -1;
        this.message1 = "Payment failed";
      }
    });
  }
  
}
