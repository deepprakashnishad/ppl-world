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
import {MarriageService} from './../marriage.service';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-caste-search',
  templateUrl: './caste-search.component.html',
  styleUrls: []
})
export class CasteSearchComponent implements OnInit {

	cntl = new FormControl();
  @Input() selectedCaste: any;

	@Output() casteSelected = new EventEmitter<any>();

	@ViewChild(MatAutocompleteTrigger) trigger;

  filteredCastes: Array<any>;

  limit: number=30;
  offset: number=0;
  searchStr: string = "";

  constructor(
  	private mService: MarriageService,
    private notifier: NotifierService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  	this.cntl.valueChanges.subscribe(val => {
      if(typeof val === "string" && val.length > 3){
        this.searchStr = val;
        this.offset = 0;
        this.fetchCasteList();
      }
  	});
  }

  fetchCasteList(){
    this.mService.fetchFilteredCasteList(this.searchStr, this.limit, this.offset)
    .subscribe((castes)=>{
      if(this.offset===0){
        this.filteredCastes = castes;
      }else{
        this.filteredCastes.concat(castes);
      }
    });
  }

  onFocus(){
    this.trigger._onChange(""); 
    this.trigger.openPanel();
  }

  selected($event){
    this.selectedCaste = $event.option.value;
  	this.casteSelected.emit($event.option.value);
  }

  displayFn(item: any): string | undefined{
    console.log(item);
    if(item){
      var temp = `${item.s}, ${item.c}, ${item.sc}`;
      return temp;
    }else{
      return undefined;
    }
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    for (let propName in changes) {
      if(propName==="selectedCaste" && changes['selectedCaste'].currentValue !== undefined){
        this.cntl.setValue(this.selectedCaste);
      } 
    }
  }
}
