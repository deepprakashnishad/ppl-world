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
  @Input() mLink: string = "";
  @Input() mTitle: string = "GoodAct - Help and Grow"

  whatsAppUrl: string = "whatsapp://send?text={mTxt}";
  smsUrl: string = "sms://body={mTxt}";
  emailUrl: string = "mailto:?Subject={mTitle}&body={mTxt}";
  twitterUrl: string = "https://twitter.com/intent/tweet?text={mTxt}&hashtags={mTitle}";
  instagramUrl: string = "https://www.instagram.com/?url={mLink}";

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ShareComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    this.mTxt = data.mTxt;
  }

  ngOnInit(){
    this.whatsAppUrl = encodeURI(this.whatsAppUrl.replace("{mTxt}", this.mTxt));
    this.smsUrl = encodeURI(this.smsUrl.replace("{mTxt}", this.mTxt));
    this.emailUrl = encodeURI(this.emailUrl.replace("{mTxt}", this.mTxt).replace("{mTitle}", this.mTitle));
    this.twitterUrl = encodeURI(this.twitterUrl.replace("{mTxt}", this.mTxt).replace("{mTitle}", this.mTitle));
    this.instagramUrl = encodeURI(this.instagramUrl.replace("{mLink}", this.mLink));
    console.log(this.whatsAppUrl);
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}