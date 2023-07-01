import { 
  Component, 
  OnInit, 
} from '@angular/core';
import {FormControl} from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ProfileService } from './profile.service';
import { Person } from  './../person/person';
import { environment } from './../../environments/environment';
import { ShareComponent } from './../shared/share/share.component';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  person: Person = new Person();
  keys: Array<string> = [];
  maxChildOrbit: number = 0;

  selectedPersonForApproval: any;

  transferCreditsTo: any;

  transferAmt: number;

  joiningCharges: number = environment.joiningCharges;

  uploadPath: string = "";

  order: any;


  constructor(
    private profileService: ProfileService,
    private notifier: NotifierService
  ){

  }

  ngOnInit(){
    
  }
}