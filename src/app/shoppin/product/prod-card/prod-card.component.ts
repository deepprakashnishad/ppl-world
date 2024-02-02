import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Price } from 'src/app/admin/product/price';
import { Product } from 'src/app/admin/product/product';
import { CartService } from 'src/app/shoppin/cart/cart.service';
import { ShareComponent } from 'src/app/shared/share/share.component';
import {
  MatBottomSheet
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { LeadsComponent } from 'src/app/static-page/store/leads/leads.component';

@Component({
  selector: 'app-prod-card',
  templateUrl: './prod-card.component.html',
  styleUrls: ['./prod-card.component.scss']
})
export class ProdCardComponent implements OnInit {

  @Input("product") product: Product;
  qty: number;
  qtyControl = new FormControl('');
  weightAttr: string;
  selectedPrice: Price = new Price(); 
  unitDiscount: any;

  selectedDiscount: any;
  selectedIndex: number=-1;

  constructor(
    private cartService: CartService,
    private notifierService: NotifierService,
    private router: Router,
    private _bottomSheet: MatBottomSheet,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.cartService.changes.subscribe(result=>{
      if(result['key']==="cart"){
        this.qty = this.cartService.getItemQty(this.product.id);
        this.updateDiscountIndex();
      }
    });
    this.qty = this.cartService.getItemQty(this.product.id);
    this.updateDiscountIndex();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['product'] && changes['product']['currentValue']){
      this.product = changes['product']['currentValue'];
      this.selectedPrice = this.product.prices[0];
      this.updateDiscountIndex();
    }    
  }

  updateQuantity(qty){
    this.qty = qty;
    this.cartService.updateCart(this.product, this.qty, this.selectedPrice).subscribe(result=>{
      if(result){
        this.notifierService.notify("success", "Cart updated successfully");
      }else{
        this.notifierService.notify("success", "Cart updated successfully");
      }
    });
  }

  selectedDiscountUpdated(event){
    this.cartService.updateCart(this.product, event.minQty, this.selectedPrice).subscribe(result=>{
      if(result){
        this.notifierService.notify("success", "Cart updated successfully");
      }else{
        this.notifierService.notify("success", "Cart updated successfully");
      }
    });
  }

  updateDiscountIndex(){
    var discounts = this.selectedPrice.discounts;
    for(var i=0; i < discounts?.length;i++){
      if(discounts[i]?.minQty === 1 && this.selectedDiscount === undefined && (this.qty===0||this.qty===undefined)){
        this.selectedDiscount = discounts[i];
        this.unitDiscount = this.selectedDiscount;
        this.selectedIndex=-1;
      }else if(discounts[i]?.minQty <= this.qty && (this.selectedDiscount?.minQty < discounts[i]?.minQty || this.selectedDiscount===undefined)){
        this.selectedDiscount = discounts[i];
      }else if(discounts[i]?.minQty <= this.qty && this.qty<this.selectedDiscount?.minQty && this.selectedDiscount?.minQty > discounts[i].minQty){
        this.selectedDiscount = discounts[i];
      }/* else{
        this.selectedDiscount = this.unitDiscount;
      } */
    }
  }

  showDetail(){
    this.router.navigate([`product/${this.product.id}`]);
  }

  openShareBottomSheet(event){
    if(!this.product){
      this.notifierService.notify("error", "Try again in sometime.")
    }
    var mTxt = `Browse ${this.product.name} catalogue by GoodAct. It's a one stop solution for all your needs. ${environment.appUrl }/product-by-category?referrer=${encodeURIComponent(sessionStorage.getItem("m")?sessionStorage.getItem("m"):"")}`;
    this._bottomSheet.open(ShareComponent, {data: {"mTxt": mTxt, mTitle: `Share ${this.product.name} catalogue`}});
    event.stopPropagation();
  }

  call(event){
    this.router.navigate([]).then(result => {  window.open("tel: +917880873187", '_blank'); });
    event.stopPropagation();
  }

  openLeadsComponent(event){
    var dialogRef = this.dialog.open(LeadsComponent, {
        data: {
            "category": this.product.name,
            "details": {catId: this.product.id, catTitle: this.product.name, type: "product"}
        }
    });
    dialogRef.afterClosed().subscribe(result=>{
        console.log(result);
    });
    event.stopPropagation();
    return;
  }
}
