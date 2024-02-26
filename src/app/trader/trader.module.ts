import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {TraderRoutingModule} from './trader-routing.module';
import {SharedModule} from './../shared/shared.module';
import { CockpitComponent } from './cockpit/cockpit.component';
import { CreateOrderComponent } from './order/create-order/create-order.component';
import { ListOrderComponent } from './order/list-order/list-order.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { TraderComponent } from './trader.component';
import { MarketDepthComponent } from './market-depth/market-depth.component';
import { TraderService } from './trader.service';

@NgModule({
  declarations: [
    CockpitComponent,
    CreateOrderComponent,
    ListOrderComponent,
    MarketDepthComponent,
    PortfolioComponent,
    TraderComponent
  ],
  imports: [
    SharedModule,
    TraderRoutingModule
  ],
  entryComponents:[],
  providers:[TraderService],
  exports: []
})
export class TraderModule { }
