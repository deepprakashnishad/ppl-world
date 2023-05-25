import { 
  Component, 
  OnInit, 
} from '@angular/core';
import {FormControl} from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ProfileService } from './profile.service';
import { Person } from  './../person/person';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  personDetail: Person = new Person();

  constructor(private profileService: ProfileService){

  }

  ngOnInit(){
    this.profileService.getPersonDetail().subscribe(result=>{
      this.personDetail = Person.fromJSON(result);
      console.log(this.personDetail);
    });
  }

}