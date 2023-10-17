import { Component, NgZone, OnInit, Input, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { environment } from 'src/environments/environment';
import { PaymentService } from 'src/app/payment/payment.service';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA
} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-collect-donation-from-others',
  templateUrl: './collect-donation-from-others.component.html',
  styleUrls: []
})
export class CollectDonationFromOthersComponent implements OnInit {

  campaign: any;
  amount: number;
  donor: string;
  isAnonymous: boolean = false;
  canCollectDonation: boolean = false;
  modeOfPayment: string = "CASH";
  paymentDetails: any = {};

  isLoggedIn: boolean;

  constructor(
    private router: Router,
    private _bottomSheetRef: MatBottomSheetRef<CollectDonationFromOthersComponent>,
    private paymentService: PaymentService,
    private authenticationService: AuthenticationService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private notifier: NotifierService
  ){
    this.authenticationService.isLoggedIn.subscribe(res=>this.isLoggedIn = res);
    if(data){
      this.campaign = data;
    }
  }

  ngOnInit(){
    this.canCollectDonation = this.authenticationService.authorizeUser(['CAN_COLLECT_DONATION']);

    if(!this.canCollectDonation || !this.isLoggedIn){
      this.authenticationService.redirectUrl = this.router.url;
      this.router.navigate(['/login']);
      this._bottomSheetRef.dismiss();
    }
  }

  donate(){
    if(!this.campaign){
      return this.notifier.notify("error", "Campaign missing!!!");
    }

    if(this.amount <= 0){
      return this.notifier.notify("error", "Amount should be greater than 0"); 
    }

    this.paymentService.collectDonationFromOthers(this.campaign.id, this.campaign.title, this.amount, this.isAnonymous, this.donor, this.modeOfPayment, this.paymentDetails).subscribe(result=>{
      this.notifier.notify("success", "Donation successfull. Thank you for your donation.");
      this._bottomSheetRef.dismiss();
    });
  }

  donorSelected(event){
    this.donor = event.id;
  }
}