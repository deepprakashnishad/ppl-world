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
import { MatDialog } from '@angular/material/dialog';
import { TraderService } from '../trader.service';
import { TranslateService } from '@ngx-translate/core';

const maxLevel = 4;

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.scss']
})
export class CockpitComponent implements OnInit {
  constructor(
    private traderService: TraderService
  ){

  }

  ngOnInit(){}
}