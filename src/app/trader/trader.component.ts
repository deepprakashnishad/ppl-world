import { 
  Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { map, mergeMap, startWith, mergeMapTo } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trader',
  templateUrl: './trader.component.html',
  styleUrls: ['./trader.component.scss']
})
export class TraderComponent implements OnInit {


  constructor(
    private router: Router
  ){
    
  }

  ngOnInit(){
    
  }

  navigateTo(url){
    this.router.navigate([url]);
  }

}