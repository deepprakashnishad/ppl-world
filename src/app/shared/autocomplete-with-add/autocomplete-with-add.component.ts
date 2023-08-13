import { Component, Input, Output, EventEmitter, AfterViewInit, ElementRef, ViewChild, SimpleChange } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { TagEditorComponent } from '../tag-autocomplete/tag-editor/tag-editor.component';
import { Observable } from 'rxjs';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
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

  @Input("label") label: string = "Item";
  @Input("displayKey") displayKey: string;
  @Input("filterKey") filterKey: string;
  @Input("key") key: string;
  @Output("tagSelected") tagSelected: EventEmitter<any> = new EventEmitter();;
  @Input("items") items: Array<any> = [];
  @Input("enableAdd") enableAdd: boolean = true;

  @Input("addTagEnabled") addTagEnabled:boolean = false;

  @ViewChild('itemInput') itemInput: ElementRef<HTMLInputElement>;
  @ViewChild('itemInputTrigger', {read: MatAutocompleteTrigger}) itemInputTrigger: MatAutocompleteTrigger;
  @ViewChild('auto') itemAuto: MatAutocomplete;

  constructor(
    private generalService: GeneralService,
  ) {
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
        if(propName === "items" && changedProp.currentValue !== undefined){
          this.subscribeInput();
        }
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
        if(propName === "filterKey" && changedProp.currentValue !== undefined){
          if(!this.displayKey){
            this.displayKey = this.filterKey;
          }
        }
        if(propName === "displayKey" && changedProp.currentValue !== undefined){
          if(!this.filterKey){
            this.filterKey = this.displayKey;
          }
        }
        console.log(changedProp);
        console.log(this.displayKey);
      }
  }

  subscribeInput(){
    this.filteredItems = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map((filterStr: string) => {
        var list = this._filter(filterStr, this.items);
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
    if(this.key){
      this.generalService.getTags(this.key).subscribe(result=>{
        if(result.success && result.tags && result.tags[this.selectedLanguage]){
          this.items = result.tags[this.selectedLanguage];  
        }else{
          this.items = [];
        }
        
        this.subscribeInput();
      });
    }
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
    if(this.itemCtrl && this.itemCtrl.value && this.itemCtrl.value.length<=0){
      return;
    }
    if (!this.items.some(entry => entry === this.itemCtrl.value)) {
      const index = this.items.push(this.itemCtrl.value) - 1;
      this.itemCtrl.setValue(this.items[index]);
      /*if(!this.enableAdd){
        this.generalService.updateTag(this.key, [this.itemCtrl.value]).subscribe(result=>{
          console.log(result);
        });
      }*/
    }
  }

  displayFn(obj){
    if(!obj){
      return "";
    }
    if(this.displayKey){
      return obj[this.displayKey]?obj[this.displayKey]:"";
    }else{
      return obj;
    }    
  }

  /*openTagEditorDialog(){
    const dialogRef = this.dialog.open(TagEditorComponent, {
      data: {
        key: this.key,
        items: this.items
      }
    })
  }*/

  /*removePromptFromOption(option) {
    if (option.startsWith(this.prompt)) {
      option = option.substring(this.prompt.length, option.length -1);
    }
    return option;
  }*/
}