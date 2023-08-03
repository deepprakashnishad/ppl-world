import { Component, NgZone, OnInit, Input, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './../../authentication/authentication.service';
import { environment } from 'src/environments/environment';
import { PaymentService } from '../payment.service';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA
} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-donate-from-ga',
  templateUrl: './donate-from-ga.component.html',
  styleUrls: ['./donate-from-ga.component.scss']
})
export class DonateFromGAComponent implements OnInit {

  campaign: any;
  amount: number;
  personId: string;
  availableDQ: number;
  isAnonymous: boolean = false;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<DonateFromGAComponent>,
    private paymentService: PaymentService,
    private authenticationService: AuthenticationService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private notifier: NotifierService
  ){
    if(data){
      this.campaign = data;
    }

    this.availableDQ = +this.authenticationService.getTokenOrOtherStoredData("dq");
  }

  ngOnInit(){
  }

  donate(){
    if(!this.campaign){
      return this.notifier.notify("error", "Campaign missing!!!");
    }

    if(this.amount > this.availableDQ){
      return this.notifier.notify("error", "Donation amount cannot be greater than available donation quota"); 
    }

    if(this.amount <= 0){
      return this.notifier.notify("error", "Amount should be greater than 0"); 
    }

    this.paymentService.donateFromGAAcc(this.campaign.id, this.amount, this.isAnonymous, this.campaign.title).subscribe(result=>{
      this.notifier.notify("success", "Donation successfull. Thank you for your donation.");
    });
  }
}