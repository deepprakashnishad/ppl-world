import { 
  Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router, RoutesRecognized} from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { map, mergeMap, startWith, mergeMapTo } from 'rxjs/operators';
import {
  MatBottomSheet
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { TraderService } from '../trader.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-market-depth',
  templateUrl: './market-depth.component.html',
  styleUrls: ['./market-depth.component.scss']
})
export class MarketDepthComponent implements OnInit, OnChanges {

  @Input() entityId: string;
  buyQuotes: Array<any>;
  sellQuotes: Array<any>;

  constructor(
    private traderService: TraderService
  ){
    
  }

  ngOnInit(){}

  ngOnChanges(changes: SimpleChanges){
    if(changes['entityId'] && changes['entityId']["currentValue"]){
      this.fetchMarketDepth();
    }
  }

  orderCountUpdated(event){
  }

  fetchMarketDepth(){
    this.traderService.getMarketDepth(this.entityId).subscribe(result=>{
      this.buyQuotes = result["market"][0]['buySide'];
      this.sellQuotes = result["market"][0]['sellSide'];
      /*if(this.buyQuotes[0]['_id'].p >= this.sellQuotes[0]['_id'].p){
        this.traderService.executeOrdersInBackground(this.entityId).subscribe(result=>{
          console.log(result);
        });
      }*/
    });
  }


}