import { Component, OnInit, ViewChild, EventEmitter, ElementRef, Inject, Input, Output, SimpleChange } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { GeneralService } from 'src/app/general.service';
import {MatDialog} from '@angular/material/dialog';
import {TagEditorComponent} from './../tag-autocomplete/tag-editor/tag-editor.component';

@Component({
  selector: 'app-tag-chip-input',
  templateUrl: './tag-chip-input.component.html',
  styleUrls: []
})
export class TagChipInputComponent implements OnInit {

	@Input() inputLabel:string = "Start Typing...";
	@Input() selectedTags: any = [];
	@Input() inputTags: Array<any>=[];
	tags: Array<any>=[];
	@Input() displayKey: string= "tagname";
	@Input() filterKey: string= "tagname";
	@Input() key: string;

	tagFilteredList: Observable<any[]>;
	inputCntl=new FormControl();
	readonly separatorKeysCodes: number[] = [ENTER, COMMA];


	@ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
	@ViewChild('tagAuto') tagAuto: MatAutocomplete;
  @ViewChild('itemInputTrigger', {read: MatAutocompleteTrigger}) itemInputTrigger: MatAutocompleteTrigger;

  selectedLanguage: string;

  @Output("selectedTagEmitter") selectedTagEmitter: EventEmitter<any> = new EventEmitter();
  	
	constructor(
		private generalService: GeneralService, private dialog: MatDialog
	) { }

	ngOnInit() {
  	this.generalService.selectedLanguage.subscribe(result=>{
  		this.selectedLanguage = result;
  	});
	}

	subscribeInput(){
		this.tagFilteredList = this.inputCntl.valueChanges.pipe(
    startWith(''),
    map((filterStr: string | null) => {
      return this._filter(filterStr, this.tags)
    }));
	}

	sanitizeInputTags(){
		this.tags=[];
    if(!this.inputTags){
      this.inputTags = [];
    }
		this.inputTags.forEach(ele => {
			this.tags.push({tid: ele.tid, tagname: ele.tags[this.selectedLanguage]});
		});
		this.subscribeInput();
	}

  sanitizeSelectedTags(){
    if(!this.selectedTags){
      this.selectedTags = [];
    }
    if(this.tags && this.tags.length>0){
      this.selectedTags = this.selectedTags.map(ele=>{
        return this.tags.find(tag=>tag.tid===ele);
      });  
    }    
  }

	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    for (let propName in changes) {
      let changedProp = changes[propName];
      if(propName.toLowerCase() === "key" && changedProp.currentValue !== undefined){
        this.fetchTags(); 
      }
      if(propName === "inputTags" && changedProp.currentValue !== undefined){
      	this.sanitizeInputTags();
      }
      if(propName === "displayKey" && changedProp.currentValue !== undefined){
        if(!this.filterKey){
        	this.filterKey = this.displayKey;
        }
      }
      if(propName === "filterKey" && changedProp.currentValue !== undefined){
        if(!this.displayKey){
        	this.displayKey = this.filterKey;
        }
      }
      if(propName === "selectedTags" && changedProp.currentValue === undefined){
        this.selectedTags = [];
      }else{
        this.sanitizeSelectedTags();
      }
    }
  }

  fetchTags(){
    if(this.key){
      this.generalService.getTags(this.key).subscribe(result=>{
        if(result.length>0){
          this.inputTags = result;
        }else{
          // this.items = [];
        }
        this.sanitizeInputTags();
        this.sanitizeSelectedTags();
      });
    }
  }

	_filter(value:string, list: Array<any>): Array<any>{
		var result;
    if(value && typeof value==="string"){
      const filterValue = value.toLowerCase();
        list = list.filter(option => (option[this.filterKey].toLowerCase()
        	.includes(filterValue) && this.selectedTags.indexOf(option)<0));  
    } 
    return list;
  } 

	selected(event: MatAutocompleteSelectedEvent){
		if(this.selectedTags.indexOf(event.option.value)<0){
			this.selectedTags.push(event.option.value);
	    this.inputCntl.setValue(null);
	    this.tagInput.nativeElement.value='';
	    this.selectedTagEmitter.emit(this.selectedTags);
		}
	}

	remove(tag: any): void {
    const index = this.selectedTags.indexOf(tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
    this.selectedTagEmitter.emit(this.selectedTags);
	}

	openTagEditorDialog(){
		const dialogRef = this.dialog.open(TagEditorComponent, {
      data: {
        key: this.key,
        items: this.inputTags
      }
    });

    dialogRef.afterClosed().subscribe(result=>{
      var foundFlag = false;
      for(var i=0;i<this.inputTags.length;i++){
        if(result && this.inputTags[i]['tid']===result['tid']){
          this.inputTags[i]['uat'] = result['uat'];
          this.inputTags[i]['tags'][result['lang']] = result['newTag'];
          foundFlag = true;
          break;
        }
      }

      if(!foundFlag){
        var data = {tid: result['tid'], uat: result['uat'], tags: {}};
        data['tags'][result['lang']] = result['newTag'];
        this.inputTags.push(data);
      }

      this.sanitizeInputTags();
    });
	}

	add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if(!this.key || value.length===0){
    	return;
    }
	}

	openPanel(){
    this.itemInputTrigger.openPanel();
  }

  displayFn(obj){
    if(!obj){
      return "";
    }
    return obj[this.displayKey];
  }

}