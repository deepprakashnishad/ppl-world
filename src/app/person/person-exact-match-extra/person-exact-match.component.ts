import { 
  Component, 
  OnInit, 
  Output, 
  Input,
  ViewChild, 
  EventEmitter,
  SimpleChanges,
  ElementRef
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {PersonService} from './../person.service';
import { MyIdbService, PERSON_STORE } from 'src/app/my-idb.service';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import {  MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap, filter } from 'rxjs/operators';

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

  foundFlag: boolean = false;

  savedPersonList: Array<any> = [];

  filteredList: Observable<any[]>;
  inputCntl = new FormControl();

  @ViewChild('mInput') mInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') auto: MatAutocomplete;

  constructor(
    private personService: PersonService,
    private notifier: NotifierService,
    private translate: TranslateService,
    private idbService: MyIdbService
  ) { }

  ngOnInit() {
    this.initializeLocalSavedData();
  }

  initializeLocalSavedData(){
    this.idbService.getAll(PERSON_STORE).then(result=>{
      this.savedPersonList = result;
      this.filteredList = this.inputCntl.valueChanges.pipe(
        startWith(''),
        map((filterStr: string | null) => {
          return this._filter(filterStr, this.savedPersonList)
        }));
      });
  }

  _filter(value:string, list: Array<any>): Array<any>{
    if(this.savedPersonList === undefined){
      this.savedPersonList = [];
    }
    if(value && typeof value==="string"){
      const filterValue = value.toLowerCase();
      return list.filter(option =>{
        if(option.n.toLowerCase().includes(filterValue.toLowerCase()) || 
          option.m.substring(3).startsWith(filterValue)){
          return option;
        }
      }); 
    } else if(list){
      return list.filter(option => this.savedPersonList?.indexOf(option)<0);
    }
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
    if(!this.mobileNumber || this.mobileNumber.length!=10 || !this.mobileNumber.match(/^\d{10}$/)){
      this.notifier.notify("error", this.translate.instant("VALID_MOBILE_PROMPT"));
      return; 
    }
    this.personService.fetchReferrer(`+91${this.mobileNumber}`, this.detail, this.type)
    .subscribe((person)=>{
      this.person = person;
      this.personSelected.emit({person: person, mobile: `+91${this.mobileNumber}`});
      this.savePersonDetailsLocally(person);
    }, (err)=>{
      console.log(err);
      this.personSelected.emit({person: undefined, mobile: `+91${this.mobileNumber}`});
    });
  }

  savePersonDetailsLocally(person){
    var data = {};
    delete person.success;
    delete person.msg;
    data[person.m] = person;
    this.idbService.setValue(PERSON_STORE, data).then(result=>{});
  }

  selected(event){
    console.log(event.option.value);
    if(event.option.value.id){
      this.mobileNumber = event.option.value.m.substring(3);
      this.person = event.option.value;
      this.personSelected.emit({person: event.option.value, mobile: event.option.value.m});
      this.foundFlag = true;
    }
  }

  reset(){
    this.person = {n:"", m:"", s:"", e: "", p:"", co: ""};
    this.mobileNumber = "";
    this.foundFlag = false;
  }

  textChanged(){
    if(this.mobileNumber && this.mobileNumber.length===10 && this.mobileNumber.match(/^\d{10}$/) && !this.foundFlag){
      this.fetchPersonList();
    }
  }
}