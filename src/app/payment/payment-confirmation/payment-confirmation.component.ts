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

  redirectUrl: string = "/";

  isPaymentSuccessful: number = 0;

  message1: string = "Please Wait...Payment Verification In Progress";

  message2: string = "Thank you for contribution towards society.";

  remainingTime: number=6;

  navigateTimeout: any;

  decrementInterval: any;

  constructor(
    private paymentService: PaymentService,
    private activatedRoute: ActivatedRoute,
    private notifier: NotifierService,
    private router: Router
  ) { 
    this.activatedRoute.queryParams.subscribe(params=>{
      if(params['redirection_url']){
        this.redirectUrl = params['redirection_url'];
      }
      if(params['merchantTransactionId']){
        this.merchantTransactionId = params['merchantTransactionId'];  
        this.fetchPaymentStatus();
      }else{
        this.router.navigate(['/']);
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
        this.decrementInterval = setInterval(()=>{this.remainingTime = this.remainingTime-1}, 1000, "decrementTime");
        this.navigateTimeout = setTimeout(()=>{
          this.router.navigate([this.redirectUrl]);
        }, 6000, "navigate");
      }else{
        this.notifier.notify("error", "Payment failed. Please try again.");
        this.isPaymentSuccessful = -1;
        this.message1 = "Payment failed";
      }
    });
  }

  navigateTo(){
    clearTimeout(this.navigateTimeout);
    clearInterval(this.decrementInterval);
    this.router.navigate([this.redirectUrl]);    
  }
  
}
