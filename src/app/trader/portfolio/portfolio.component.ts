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
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  portfolio: any;
  entities: any = {};
  stocks: Array<any> = [];
  totalPortfolioActualValue: number = 0;
  totalPortfolioLTPValue: number = 0;

  amountToAdd: number;

  amountToWithdraw: number;

  constructor(
    private traderService: TraderService
  ){

  }

  ngOnInit(){
    this.getPortfolio();
  }

  getPortfolio(){
    this.traderService.getPortfolio().subscribe(result=>{
      this.initializePortfolio(result);
    });
  }

  initialize(){
    this.traderService.initialize().subscribe(result=>{
      this.initializePortfolio(result);
    });
  }

  initializePortfolio(result){
    for(var entity of result.entities){
      this.entities[entity.id] = {};
      this.entities[entity.id] = entity;
    }
    this.portfolio = result.portfolio;

    this.totalPortfolioActualValue = 0;
    this.totalPortfolioLTPValue = 0;
    for(var stock of Object.keys(this.portfolio.eq)){
      this.totalPortfolioActualValue += this.portfolio.eq[stock]*this.entities[stock]['ap'];
      this.totalPortfolioLTPValue += this.portfolio.eq[stock]*this.entities[stock]['ltp'];
    }
  }

  addFundsViaGoodAct(){
    this.traderService.transactMoney(this.amountToAdd, false).subscribe(result=>{
      console.log(result);
    })
  }

  withdrawFunds(){
    this.traderService.transactMoney(this.amountToWithdraw, true).subscribe(result=>{
      console.log(result);
    })
  }
}