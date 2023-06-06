import { 
  Component, 
  OnInit, 
  Output, 
  Input,
  ViewChild, 
  EventEmitter,
  SimpleChange 
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {PersonService} from './../person.service';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-person-exact-match',
  templateUrl: './person-exact-match.component.html',
  styleUrls: ['./person-exact-match.component.scss']
})
export class PersonExactMatchComponent implements OnInit {

  mobileNumber: string="";

  person: any = {n:"", m:"", s:"", e: "", p:"", co: ""};

  @Input("detail") detail = "min";

  @Output() personSelected = new EventEmitter<any>();
  personCntl: FormControl = new FormControl();

  constructor(
    private personService: PersonService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
  }

  fetchPersonList(){
    this.personService.fetchReferrer(`+91${this.mobileNumber}`, this.detail)
    .subscribe((person)=>{
      // this.mobileNumber = `${person.n} | ${person.m} | ${person.e}`;
      this.person = person;
      this.personSelected.emit(person);
    });
  }
}