import {Component, Input, OnInit, Inject} from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA
} from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'share',
  templateUrl: 'share.component.html'
})
export class ShareComponent {

  @Input() mTxt: string = "";
  @Input() mTitle: string = "Good Act - Help and Grow"

  whatsAppUrl: string = "whatsapp://send?text={mTxt}";
  smsUrl: string = "sms://body={mTxt}";
  emailUrl: string = "mailto:?Subject={mTitle}&body={mTxt}";

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ShareComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    this.mTxt = data.mTxt;
  }

  ngOnInit(){
    console.log(this.mTxt);
    this.whatsAppUrl = encodeURI(this.whatsAppUrl.replace("{mTxt}", this.mTxt));
    console.log(this.whatsAppUrl);
    // this.smsUrl = encodeURI(this.smsUrl.replace("{mTxt}", this.mTxt));
    // this.emailUrl = encodeURI(this.emailUrl.replace("{mTxt}", this.mTxt).replace("{mTitle}", this.mTitle));
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}