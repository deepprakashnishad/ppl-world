import { Component, NgZone, OnInit, Input, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { Payment } from './payment';
import { PaymentService } from './payment.service';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA
} from '@angular/material/bottom-sheet';
import { sha256 } from 'js-sha256';

declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  readonly razorpay: string = "RAZORPAY";

  readonly phonepe: string = "PHONEPE";

  @Input() action_name: string;
  @Input() order: any = {};
  @Input() displayDetails: any = {};

  modeOfPayment: string = "online";
  orderId: string;
  payment: Payment = new Payment();
  instancePaymentComponent: PaymentComponent;
  newAmount: number;
  amount: number;
  extraInfo: any;
  redirectUrl: string = "/";

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
    private _bottomSheetRef: MatBottomSheetRef<PaymentComponent>,
    private notifier: NotifierService,
    private authenticationService: AuthenticationService,
    private paymentService: PaymentService,
    private router: Router,
    private dialog: MatDialog,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private zone: NgZone
  ) { 
    if(data.order){
      this.order = data.order;
    }

    if(data.displayDetails){
      this.displayDetails = data.displayDetails;
    }

    if(data.action_name){
      this.action_name = data.action_name;
    }

    if(data.order.amount){
      this.order.amt = data.order.amount;
    }

    if(data.order.extraInfo){
      this.order.extraInfo = data.order.extraInfo;
    }

    if(data.order.title){
      this.order.title = data.order.title;
    }

    if(data.order.desc){
      this.order.desc = data.order.desc;
    }

    if(data.order.isPersonRequired){
      this.order.isPersonRequired = data.order.isPersonRequired;
    }

    if(data.order.action){
      this.order.action = data.order.action;
    }

    if(data.order.actionDetails){
      this.order.actionDetails = data.order.actionDetails; 
    }

    if(data.redirectUrl){
      this.redirectUrl = data.redirectUrl;
    }
  }

  ngOnInit() {
  }

  placeOrder(paymentGateway) {
    if(this.orderId){
      this.notifier.notify("success", "Order is created. Please check in my orders");
      this.postSuccessProcess({ success: true, msg: "Order is already placed" });
    }else{
      this.order['paymentGateway'] = paymentGateway;

      if(!this.order.amt || this.order.amt===undefined || this.order.amt===null){
        this.order.amt = this.newAmount;
      }

      if(!this.order.amt || Number(this.order.amt.toString()) < 1){
        return this.notifier.notify("error", "Amount cannot be less than 1");
      } 

      this.paymentService.add(this.order).subscribe(result=>{
        if (result['success']) {
          this.payment = Payment.fromJSON(result);
          // this.orderId = result['id'];
          
          this.amount = result['amount'];
          console.log("Initializing payment");
          if(paymentGateway===this.phonepe){
            this.initiatePhonepePaymentFromBackend(result);
          }else if(paymentGateway===this.razorpay){
            this.initiateRazorpayForm(result);
          }
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

  initiatePhonepePaymentFromBackend(data){
    if(!this.order.amt || this.order.amt===undefined || this.order.amt===null){
      this.order.amt = this.newAmount;
    }

    if(!this.order.amt || Number(this.order.amt.toString()) < 1){
      return this.notifier.notify("error", "Amount cannot be less than 1");
    }    

    var phonepeInputData = {
      "merchantTransactionId": data.id,
      "amount": data.amt,
      "merchantUserId": this.authenticationService.getTokenOrOtherStoredData("id")?this.authenticationService.getTokenOrOtherStoredData("id"):"anonymous",
      "redirectUrl": `${environment.appUrl}/payment-confirmation?merchantTransactionId=${data.id}&amount=${data.amt}&redirection_url=${this.redirectUrl}`,
      "redirectMode": "REDIRECT",
      "callbackUrl": "https://goodact-vcm3.onrender.com/phonepe/callbackhandler",
      "mobileNumber": this.authenticationService.getTokenOrOtherStoredData("mobile"),
    }

    this.paymentService.initiatePhonepePaymentFromBackend(phonepeInputData).subscribe(response=>{
      if(response.success){
        window.location = response.data.instrumentResponse.redirectInfo.url;
      }``
    });
  }

  initiatePhonepeForm(result){

    /*if(!this.order.amt || this.order.amt===undefined || this.order.amt===null){
      this.order.amt = this.newAmount;
    }
    console.log(this.order.amt);
    if(!this.order.amt || Number(this.order.amt.toString()) < 1){
      return this.notifier.notify("error", "Amount cannot be less than 1");
    }
    
    var payload = {
      "merchantId": environment.phonepe.merchantId,
      "merchantTransactionId": "MT7850590068188104",
      "amount": this.order.amt*100,
      "merchantUserId": "TestUser123",
      "redirectUrl": "http://localhost:4200/explore",
      "redirectMode": "REDIRECT",
      "callbackUrl": "https://goodact-vcm3.onrender.com/phonepe/callbackhandler",
      "mobileNumber": "7880873187",
      "paymentInstrument": {
        "type": "PAY_PAGE"
      }
    }

    var base64Payload = btoa(JSON.stringify(payload));
    var endpoint = environment.phonepe.payUrl;
    var saltKey=environment.phonepe.saltKey;
    var saltIndex = environment.phonepe.saltIndex;

    var sha256Payload = sha256(`${base64Payload}${endpoint}${saltKey}`);

    var checksum = `${sha256Payload}###${saltIndex}`;

    this.paymentService.initiatePhonepePayment({request: base64Payload}, checksum).subscribe(response=>{
      if(response.success){
        window.location = response.data.instrumentResponse.redirectInfo.url;
      }
    });*/
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
