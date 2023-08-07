import { Component, Input, Output, EventEmitter, AfterViewInit, ElementRef, ViewChild, SimpleChange } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { GeneralService } from '../../general.service';

/**
 * @title Autocomplete with add new item option
 */
@Component({
  selector: 'app-autocomplete-with-add',
  templateUrl: 'autocomplete-with-add.component.html',
  styleUrls: ['autocomplete-with-add.component.scss']
})
export class AutocompleteWithAddComponent implements AfterViewInit {
  itemCtrl: FormControl;
  filteredItems: Observable<any[]>;
  showAddButton: boolean = false;

  selectedLanguage: string = "en";

  @Input("selectedItem") selectedItem: any;

  @Input("filterKey") filterKey: string;
  @Input("key") key: string;
  @Output("tagSelected") tagSelected: EventEmitter<any> = new EventEmitter();;
  items: Array<any> = [];

  @ViewChild('itemInput') itemInput: ElementRef<HTMLInputElement>;
  @ViewChild('itemInputTrigger', {read: MatAutocompleteTrigger}) itemInputTrigger: MatAutocompleteTrigger;
  @ViewChild('auto') itemAuto: MatAutocomplete;

  constructor(private generalService: GeneralService) {
    this.itemCtrl = new FormControl();
    /*this.filteredItems = this.itemCtrl.valueChanges
      .pipe(
      startWith(''),
      map(item => item ? this.filterItems(item) : this.items.slice())
      );*/
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
      for (let propName in changes) {
        let changedProp = changes[propName];
        if(propName.toLowerCase() === "key" && changedProp.currentValue !== undefined){
          this.fetchTags(); 
        }
        if(propName === "selectedItem" && changedProp.currentValue !== undefined){
          if(this.filterKey){
            this.itemCtrl.setValue(changedProp.currentValue[this.filterKey]);
          }else{
            this.itemCtrl.setValue(changedProp.currentValue);
          }
          
        }
      }
  }

  subscribeInput(){
    this.filteredItems = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map((filterStr: string) => {
        var list = this._filter(filterStr, this.items)
        return list;
      }));
  }



  _filter(value:string, list: Array<any>): Array<any>{
    if(list && value && typeof value==="string"){
        const filterValue = value.toLowerCase();

        var list = list.filter(option => {
          if(this.filterKey){
            return option[this.filterKey].toLowerCase().includes(filterValue);
          }else{
            return option.toLowerCase().includes(filterValue);
          }          
        });  
        return list;
    } else if(list){
      return list;
    }
  } 

  ngAfterViewInit(){
    
  }

  fetchTags(){
    this.generalService.getTags(this.key).subscribe(result=>{
      this.items = result.tags[this.selectedLanguage];
      this.subscribeInput();
    });
  }

  filterItems(name: string) {
    let results = this.items.filter(item =>{
      console.log(item);
      item.toLowerCase().indexOf(name.toLowerCase()) === 0;
    });

    return results;
  }

  optionSelected(option) {
    /*if (option.value.indexOf(this.prompt) === 0) {
      this.addOption();
    }*/
    this.tagSelected.emit(option.value);
  }

  openPanel(){
    this.itemInputTrigger.openPanel();
  }

  addOption() {
    // let option = this.removePromptFromOption(this.itemCtrl.value);
    if (!this.items.some(entry => entry === this.itemCtrl.value)) {
      const index = this.items.push(this.itemCtrl.value) - 1;
      this.itemCtrl.setValue(this.items[index]);

      this.generalService.updateTag(this.key, [this.itemCtrl.value]).subscribe(result=>{
        console.log(result);
      });
    }
  }

  /*removePromptFromOption(option) {
    if (option.startsWith(this.prompt)) {
      option = option.substring(this.prompt.length, option.length -1);
    }
    return option;
  }*/
}