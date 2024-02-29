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
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import {PersonService} from './../person.service';
import {Person} from './../person';
import { PersonAddEditComponent } from '../person-add-edit/person-add-edit.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-person-search',
  templateUrl: './person-search.component.html',
  styleUrls: ['./person-search.component.scss']
})
export class PersonSearchComponent implements OnInit {

	personControl = new FormControl();
  @Input() selectedPerson: Person;

  @Input("displayMode") displayMode = "dropdown"; //dropdown or grid

  @Input("personType") personType = "general";

	@Output() personSelected = new EventEmitter<Person>();

	@ViewChild(MatAutocompleteTrigger) trigger;

  filteredPersons: Array<Person> = [];

  searchStr: string = "";

  @ViewChild('paginator') paginator: MatPaginator;
  totalUserCnt: number = 0;

  pageSize: number=10;

  userList: Array<Person> = [];

  selectedPage:  number = 1;

  usersByPage: any = {};

  constructor(
  	private personService: PersonService,
    private notifier: NotifierService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.fetchPersonList();
  	this.personControl.valueChanges.subscribe(val => {
      if(typeof val === "string" && val.length > 3){
        this.searchStr = val;
        this.selectedPage = 1;
        this.fetchPersonList();
      }
  	});
  }

  fetchPersonList(){
    this.personService.getCustomers(this.pageSize, this.pageSize * (this.selectedPage-1), this.searchStr)
    .subscribe((result)=>{
      this.totalUserCnt= result[0].totalRecords && result[0].totalRecords.length>0?result[0].totalRecords[0]['totalCount']:0;
      result[0].data = result[0].data.map((item, index) => {
        item['sno'] = ((this.selectedPage-1)*this.pageSize) + index + 1;
        return item;
      });
      var persons = Person.fromJSONArray(result[0].data);
      this.usersByPage[this.selectedPage-1] = persons;
      this.prepareFinalUserList(persons);
    });
  }

  pageUpdated(event){
    if(this.pageSize != event.pageSize){
      this.pageSize = event.pageSize;
    }
    this.selectedPage = event.pageIndex + 1;
    if(Object.keys(this.usersByPage).indexOf((this.selectedPage-1).toString())<0){
      this.fetchPersonList();
    }
  }

  prepareFinalUserList(data){
    if(!this.userList || this.userList.length===0){
      this.userList = new Array(this.totalUserCnt).fill({});
    }
    var cnt=0;
    data.forEach(ele=>{
      this.userList[(this.selectedPage-1)*this.pageSize + cnt] = ele;
      cnt++;
    });
  }

  onFocus(){
    this.trigger._onChange(""); 
    this.trigger.openPanel();
  }

  selected($event){
    if($event.option.value.role===null){
      $event.option.value.role = {id:undefined, name: "", description:""}
    }
    this.selectedPerson = $event.option.value;
  	this.personSelected.emit($event.option.value);
  }

  selectedInGrid(person){
    this.selectedPerson = person;
  	this.personSelected.emit(person);
  }

  displayFn(item: any): string | undefined{
    return item?item.name:undefined
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    for (let propName in changes) {
      if(propName==="selectedPerson" && changes['selectedPerson'].currentValue !== undefined){
        // console.log(changes['selectedPerson'].currentValue);
        if(this.displayMode === "dropdown"){
          this.personControl.setValue(changes['selectedPerson'].currentValue.name);
        }
      } 
    }
  }

  onEditClick(person){
    const dialogRef = this.dialog.open(PersonAddEditComponent, {
      data: {
        "person": person
      },
      height: "100%",
      width: "100%"
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.selectedPerson = result;
        this.notifier.notify("success", this.selectedPerson.name+" updated successfully");
        // this.openSnackBar(this.selectedPerson.name+" updated successfully", "Dismiss");
      }
      
    });
  }

  openResetPasswordDialog(person){
    const dialogRef = this.dialog.open(
      ResetPasswordComponent,{
        data: {personId: person.id}
      }
    );

    dialogRef.afterClosed().subscribe(result=>{
      if(result['success']){
        this.notifier.notify("success", "Password resetted successfully");
      }
    });
  }
}
