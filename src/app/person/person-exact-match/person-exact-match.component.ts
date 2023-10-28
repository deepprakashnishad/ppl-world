import { 
  Component, 
  OnInit, 
  Output, 
  Input,
  ViewChild, 
  EventEmitter,
  SimpleChanges
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {PersonService} from './../person.service';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-person-exact-match',
  templateUrl: './person-exact-match.component.html',
  styleUrls: ['./person-exact-match.component.scss']
})
export class PersonExactMatchComponent implements OnInit {

  @Input() mobileNumber: string="";

  @Input() inputLabel: string = "Enter mobile number";

  @Input() type: string = "referrer";

  @Input() isMandatory: boolean = true;

  @Input() errorLabel: string = "Please select a person";  

  person: any = {n:"", m:"", s:"", e: "", p:"", co: ""};

  @Input("detail") detail = "min";

  @Output() personSelected = new EventEmitter<any>();
  personCntl: FormControl = new FormControl();

  constructor(
    private personService: PersonService,
    private notifier: NotifierService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.mobileNumber?.currentValue != '' && changes.mobileNumber?.currentValue){
      if(this.mobileNumber.length>10){
        this.mobileNumber = this.mobileNumber.slice(-1, 10);
      }
      this.fetchPersonList();
    }
  }

  fetchPersonList(){
    if(!this.mobileNumber || this.mobileNumber.length!=10){
      this.notifier.notify("error", this.translate.instant("VALID_MOBILE_PROMPT"));
      return;
    }
    this.personService.fetchReferrer(`+91${this.mobileNumber}`, this.detail, this.type)
    .subscribe((person)=>{
      // this.mobileNumber = `${person.n} | ${person.m} | ${person.e}`;
      this.person = person;
      this.personSelected.emit(person);
    });
  }

  reset(){
    this.person = {n:"", m:"", s:"", e: "", p:"", co: ""};
    this.mobileNumber = "";
  }
}