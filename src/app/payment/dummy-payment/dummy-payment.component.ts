import { Component, NgZone, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../authentication/authentication.service';
import { Payment } from './../payment';
import { PaymentService } from './../payment.service';

declare var Razorpay: any;

@Component({
  selector: 'app-dummy-payment',
  templateUrl: './dummy-payment.component.html',
  styleUrls: ['./dummy-payment.component.scss']
})
export class DummyPaymentComponent implements OnInit {

  readonly razorpay: string = "RAZORPAY";
  @Input() action_name: string;
  @Input() order: any;

  modeOfPayment: string = "online";
  orderId: string;
  payment: Payment = new Payment();
  instancePaymentComponent: DummyPaymentComponent;
  amount: number;

  username: string;
  userphone: string;
  useremail: string;
  mid: string;
  pg: string;
  pgid: string;
  bpid: string;
  poid: string;
  puid: string;
  prod_desc: string;
  extra_info: string;
  bettingPartnerName: string;
  bettingPartnerLogo: string;
  bpRedirectionLink: string;

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
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private zone: NgZone
  ) { 
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params);
      this.poid = params['partner_orderid'];
      this.puid = params['partner_orderid'];
      this.amount = params['amount'];
      this.username = params['username'];
      this.userphone = params['userphone']
      this.useremail = params['useremail']
      this.mid = params['mid']
      this.pg = params['pg']
      this.pgid = params['pgid']
      this.bpid = params['bpid']
      this.prod_desc = params['prod_desc']
      this.extra_info = params['extra_info']
      this.bettingPartnerName = params['betting_partner_name']
      this.bettingPartnerLogo = params['betting_partner_logo']
      this.bpRedirectionLink = params['redirection_url']
    });
  }

  placeOrder(paymentGateway) {
    this.paymentService.createDummyOrder(this.poid, this.amount).subscribe(result=>{
      if (result['success']) {
        this.payment = Payment.fromJSON(result);
        // this.orderId = result['id'];          
        this.amount = result['amount'];
        this.initiateRazorpayForm(result);
        
      } else {
        this.notifier.notify("error", "Failed to create order");
      }
    });
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
    this.razorPayOptions.prefill.name = this.username;
    this.razorPayOptions.prefill.email = this.useremail;
    this.razorPayOptions.prefill.contact = this.userphone;
    this.razorPayOptions.order_id = result['notes']['razorpay_order_id'];
    this.razorPayOptions.handler = this.razorPayCallbackHandler.bind(this);
    var rzp1 = new Razorpay(this.razorPayOptions);
    rzp1.on('payment.failed', function(response){
      alert(response.error.reason);
    });
    rzp1.open();
  }

  razorPayCallbackHandler(response){
    this.paymentService.verifyRazorpayPaymentFromAllPayServer({
      order_id: this.poid,
      amount: this.amount,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature
    }).subscribe((result)=>{
      if(result.success){

        this.paymentService.postTransactionToAllPayServer({
          bpid: this.bpid,
          partnerOrderId: this.poid,
          partnerUserId: this.puid,
          mid: this.mid,
          username: this.username, 
          phone: this.userphone, 
          email: this. useremail,
          amount: this.amount,
          paymentGateway: this.pg,
          paymentGatewayId: this.pgid,
          paymentMode: result['pd']['method'],
          extra_info: this.extra_info,
          status: result['pd']['status'],
          paymentDetails: {
            pg_orderid: result['pd']['order_id'],
            pg_txn_id: result['pd']['id'],
            pg_amount_refunded: result['pd']['amount_refunded'],
            pg_refund_status: result['pd']['refund_status'],
            card_id: result['pd']['card_id'],
            bank: result['pd']['bank'],
            wallet:result['pd']['wallet'],
            vpa:result['pd']['vpa'],
            fee:result['pd']['fee'],
            tax:result['pd']['tax'],
          }
        }).subscribe(result=>{
          this.notifier.notify("success", "Transaction completed successfully");
        });
        this.postSuccessProcess(result);  
      }
      
    });
  }

  postSuccessProcess(result){
    this.zone.run(() => {
      if (result['success']) {
        if(this.bpRedirectionLink){
          window.location.href = this.bpRedirectionLink;
        }else{
          window.location.href = 'https://google.co.in';  
        }                
      } else {
        this.notifier.notify("error", result['msg']);
      }     
    });
  }

  openConfirmationDialog() {
    console.log("Payment completed. Confirmation can be displayed");
  }
}
