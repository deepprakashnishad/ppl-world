import { 
  Component, 
  OnInit, 
  ViewChild
} from '@angular/core';
import {FormControl} from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { VolunteerService } from './../../volunteer.service';
import { GeneralService } from './../general.service';
import { Person } from  './../person/person';
import { environment } from './../../environments/environment';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { map, mergeMap, startWith, mergeMapTo } from 'rxjs/operators';
import { ShareComponent } from './../shared/share/share.component';
import {PersonExactMatchComponent} from './../person/person-exact-match/person-exact-match.component';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-donor-list',
  templateUrl: './donor-list.component.html',
  styleUrls: ['./donor-list.component.scss']
})
export class DonorListComponent implements OnInit {

  donors: Array<any> = [];

  constructor(private vService: VolunteerService){}

  ngOnInit(){
    this.fetchDonors();
  }

  fetchDonors(){
    this.fetchDonors().subscribe(result=>{
      this.donors = result;
    });
  }
}