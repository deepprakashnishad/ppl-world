import { 
  Component, 
  OnInit, 
  ViewChild
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router, RoutesRecognized} from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { map, mergeMap, startWith, mergeMapTo } from 'rxjs/operators';
import {
  MatBottomSheet
} from '@angular/material/bottom-sheet';
import { MarketDepthComponent } from './../../market-depth/market-depth.component';
import { TraderService } from '../../trader.service';
import { TranslateService } from '@ngx-translate/core';
import { Entity } from 'src/app/trader/trader';
import { environment } from 'src/environments/environment';

const maxLevel = 4;

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {

  entity: Entity=new Entity(); //Digital Slot
  price: number;
  qty: number=1;
  unitPrice: number;
  totalAmount: number;
  orderSide: string;

  @ViewChild(MarketDepthComponent) marketDepth: MarketDepthComponent;

  constructor(
    private traderService: TraderService,
    private notifier: NotifierService
  ){
    this.traderService.getEntity(this.entity?.id).subscribe(result=>{
      this.entity = Entity.fromJSON(result['entity']);
      this.price = this.entity.ltp;
    })
  }

  ngOnInit(){}

  orderCountUpdated(event){
    if(this.qty > Math.floor(environment.maxPermittedAmt/this.unitPrice)){
      this.qty = Math.floor(environment.maxPermittedAmt/this.unitPrice);
    }
    if(this.qty<1){
      this.qty=1
    }
    this.totalAmount = this.qty*this.unitPrice;
  }

  priceUpdated(event){    
    //Validate price here
    this.price = Math.round(this.price * 10) / 10
  }

  placeOrder(){
    if(this.price <=0.09){
      this.notifier.notify("error", "Price should be atleast 0.1");
      return;
    }

    if(!this.orderSide || (this.orderSide!=="B" && this.orderSide!=="S")){
      this.notifier.notify("error", "You wish to sell or buy");
      return;
    }

    if(!this.qty || this.qty<=0){
      this.notifier.notify("error", "Minimum 1 quantity");
      return;
    }

    if(!this.entity){
      this.notifier.notify("error", "Entity is missing");
      return;
    }

    this.traderService.placeOrder(this.price, this.entity.id, this.orderSide, this.qty).subscribe(result=>{
      if(result['success']){
        this.notifier.notify("success", "Order created successfully");
        this.marketDepth.fetchMarketDepth();
        this.reset();
      }else{
        this.notifier.notify("error", result['msg']?result['msg']: "Order failed");
      }
    })
  }

  reset(){
    this.qty = 0;
    this.price = undefined; 
    this.orderSide = undefined;
  }
}