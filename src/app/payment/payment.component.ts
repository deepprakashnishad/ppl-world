import { Component, NgZone, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { CheckoutService } from 'paytm-blink-checkout-angular';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { Payment } from './payment';
import { PaymentService } from './payment.service';

declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  readonly razorpay: string = "RAZORPAY";
  @Input() action_name: string;
  @Input() order: any;

  modeOfPayment: string = "online";
  orderId: string;
  payment: Payment = new Payment();
  instancePaymentComponent: PaymentComponent;
  amount: number;

  private subs: Subscription;

  storeSettings = JSON.parse(sessionStorage.getItem("storeSettings"));

  razorPayOptions = {
    "key": "", // Enter the Key ID generated from the Dashboard
    "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": environment.appName,
    "description": "Healthy & pure products from everything satvik",
    "image": this.storeSettings?.logo?.downloadUrl, //environment.logoUrl,
    "order_id": "", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": this.razorPayCallbackHandler.bind(this),
    "prefill": {
        "name": "",
        "email": "",
        "contact": ""
    },
    "notes": {
        "address": ""
    },
    "theme": {
      "color": "#731539"
    }
  }

  constructor(
    private notifier: NotifierService,
    private authenticationService: AuthenticationService,
    private paymentService: PaymentService,
    private router: Router,
    private dialog: MatDialog,
    private zone: NgZone
  ) { 
  }

  ngOnInit() {
  }

  placeOrder(paymentGateway) {
    if(this.orderId){
      this.notifier.notify("success", "Order is created. Please check in my orders");
      this.postSuccessProcess({ success: true, msg: "Order is already placed" });
    }else{
      this.paymentService.add(this.order).subscribe(result=>{
        if (result['success']) {
          
          this.payment = Payment.fromJSON(result);

          // this.orderId = result['id'];
          
          this.amount = result['amount'];
          this.initiateRazorpayForm(result);
          
        } else {
          this.notifier.notify("error", "Failed to create order");
        }
      })
    }
  }

  notifyPaytmHandler = (eventType, data): void => {
    console.log('MERCHANT NOTIFY LOG', eventType, data);
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  initiateRazorpayForm(result) {
    var usermob = this.authenticationService.getTokenOrOtherStoredData("mobile").toString();
    this.orderId = result['id'];
    this.razorPayOptions.key = environment.razorpay.keyId;
    this.razorPayOptions.amount = result['amount'];
    this.razorPayOptions.prefill.name = this.authenticationService.getTokenOrOtherStoredData("name");
    this.razorPayOptions.prefill.email = this.authenticationService.getTokenOrOtherStoredData("email");
    this.razorPayOptions.prefill.contact = usermob;
    this.razorPayOptions.order_id = result['notes']['razorpay_order_id'];
    this.razorPayOptions.handler = this.razorPayCallbackHandler.bind(this);
    var rzp1 = new Razorpay(this.razorPayOptions);
    rzp1.on('payment.failed', function(response){
      alert(response.error.reason);
    });
    rzp1.open();
  }

  razorPayCallbackHandler(response){
    this.paymentService.verifyRazorpayPayment({
      order_id: this.orderId,
      payment_id: this.payment.id,
      amount: this.amount,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature
    }).subscribe((result)=>{
      console.log(result);
      this.postSuccessProcess(result);
    });
  }

  postSuccessProcess(result){
    this.zone.run(() => {
      if (result['success']) {
        this.notifier.notify("success", result['msg']);
        this.openConfirmationDialog();
        this.router.navigate(['/profile']);
      } else {
        this.notifier.notify("error", result['msg']);
      }     
    });
  }

  openConfirmationDialog() {
    console.log("Payment completed. Confirmation can be displayed");
    /*this.dialog.open(OrderConfirmationComponent, {
      data: this.orderId,
    });*/
  }
}
