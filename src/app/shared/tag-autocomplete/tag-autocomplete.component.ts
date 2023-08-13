import { Component, Input, Output, EventEmitter, AfterViewInit, ElementRef, ViewChild, SimpleChange } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {TagEditorComponent } from './tag-editor/tag-editor.component';
import { Observable } from 'rxjs';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { GeneralService } from '../../general.service';
import {MatDialog} from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

/**
 * @title Autocomplete with add new item option
 */
@Component({
  selector: 'app-tag-autocomplete',
  templateUrl: 'tag-autocomplete.component.html',
  styleUrls: ['tag-autocomplete.component.scss']
})
export class TagAutocompleteComponent {
  itemCtrl: FormControl;
  filteredItems: Observable<any[]>;
  showAddButton: boolean = false;

  selectedLanguage: string;

  @Input("selectedTagId") selectedTagId: string;
  selectedItem: any;

  @Input("label") label: string = "Item";

  @Input("displayKey") displayKey: string="tagname";
  @Input("filterKey") filterKey: string="tagname";
  @Input("key") key: string;
  @Output("tagSelected") tagSelected: EventEmitter<any> = new EventEmitter();;
  @Input("items") items: Array<any> = [];
  @Input("enableAdd") enableAdd: boolean = true;

  keyTags: any;

  @ViewChild('itemInput') itemInput: ElementRef<HTMLInputElement>;
  @ViewChild('itemInputTrigger', {read: MatAutocompleteTrigger}) itemInputTrigger: MatAutocompleteTrigger;
  @ViewChild('auto') itemAuto: MatAutocomplete;

  constructor(private generalService: GeneralService, private dialog: MatDialog,) {
    this.itemCtrl = new FormControl();

    this.generalService.selectedLanguage.subscribe(value=>{
      this.selectedLanguage = value;
      console.log(this.keyTags);
      if(this.keyTags){
        this.items = this.keyTags.map(tag=>{
         return {
          tagId: tag.tid,
          tagname: tag.tags[this.selectedLanguage]? tag.tags[this.selectedLanguage]: tag.tags[environment.defaultLang]
         };
        });
        this.subscribeInput();
      }
    });
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
    }
  }

  subscribeInput(){
    this.setSelectedItem();
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

  fetchTags(){
    if(this.key){
      this.generalService.getTags(this.key).subscribe(result=>{
        if(result.length>0){
          this.keyTags = result;
          this.mapKeyTagsToItems();
        }else{
          this.items = [];
        }
        this.subscribeInput();
      });
    }
  }

  mapKeyTagsToItems(){
    this.items = this.keyTags.map(tag=>{
       return {
        tagId: tag.tid,
        tagname: tag.tags[this.selectedLanguage]? tag.tags[this.selectedLanguage]: tag.tags[environment.defaultLang]
       };
      });

    console.log(this.items);
    this.subscribeInput();
  }

  setSelectedItem(){
    for(var i=0;i<this.items.length;i++){
      if(this.items[i]['tagId'] === this.selectedTagId){
        this.selectedItem = this.items[i];
        this.itemCtrl.setValue(this.selectedItem);
      }
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
    this.tagSelected.emit(option.value);
  }

  openPanel(){
    this.itemInputTrigger.openPanel();
  }

  addOption() {
    if(this.itemCtrl.value.length<=0){
      return;
    }
    if (!this.items.some(entry => entry === this.itemCtrl.value)) {

      /*const index = this.items.push(this.itemCtrl.value) - 1;
      this.itemCtrl.setValue(this.items[index]);

      if(!this.enableAdd){
        this.generalService.updateTag(this.key, [tag]).subscribe(result=>{
          console.log(result);
        });
      }*/
    }
  }

  openTagEditorDialog(){
    const dialogRef = this.dialog.open(TagEditorComponent, {
      data: {
        key: this.key,
        items: this.keyTags
      }
    });

    dialogRef.afterClosed().subscribe(result=>{
      var foundFlag = false;
      for(var i=0;i<this.keyTags.length;i++){
        if(this.keyTags[i]['tid']===result['tid']){
          this.keyTags[i]['uat'] = result['uat'];
          this.keyTags[i]['tags'][result['lang']] = result['newTag'];
          foundFlag = true;
          break;
        }
      }

      if(!foundFlag){
        var data = {tid: result['tid'], uat: result['uat'], tags: {}};
        data['tags'][result['lang']] = result['newTag'];
        this.keyTags.push(data);
      }

      this.mapKeyTagsToItems();
    });
  }

  displayFn(obj){
    if(!obj){
      return "";
    }
    return obj[this.displayKey];
  }

  /*removePromptFromOption(option) {
    if (option.startsWith(this.prompt)) {
      option = option.substring(this.prompt.length, option.length -1);
    }
    return option;
  }*/
}