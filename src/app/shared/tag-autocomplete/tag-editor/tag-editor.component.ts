
import { Component, Input, Output, EventEmitter, AfterViewInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { environment } from './../../../../environments/environment'
import { Observable } from 'rxjs';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { GeneralService } from '../../../general.service';
import { NotifierService } from 'angular-notifier';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * @title Autocomplete with add new item option
 */
@Component({
  selector: 'app-tag-editor',
  templateUrl: 'tag-editor.component.html',
  styleUrls: []
})
export class TagEditorComponent {

  key: string;
  prevValues: any;
  langs: any = environment.langs;
  newTag: string;
  selectedFromLang: string;
  selectedToLang: string;

  tagExists: boolean = false;

  selectedLangItems: Array<any> = [];

  tagId: string;

  keyTags: any;


  constructor(
    private notifier: NotifierService,
    private generalService: GeneralService,
    public dialogRef: MatDialogRef<TagEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    if(!data.key){
      this.notifier.notify("error", "Key missing. Cannot add tag without key");
      dialogRef.close();
    }else{
      this.key = data.key;
      this.keyTags = data.items
    }
  }

  existingTagLanguageSelected(event){
    this.selectedLangItems = this.keyTags.map(tag=>{
      return {
        tagId: tag.tid,
        tagname: tag.tags[event.value]? tag.tags[event.value]: tag.tags[environment.defaultLang]
      };
    });
  }

  tagExistsModified(event){}

  save(){
    if((!this.selectedToLang || this.newTag.length<=0)){
      this.notifier.notify("error", "Language and name are mandatory");
      return;
    }

    if(this.tagExists && !this.tagId){
      this.notifier.notify("error", "Please select existing tag");
      return;
    }
    this.generalService.updateTag(this.key, this.tagId, this.newTag, this.selectedToLang).subscribe(result=>{
      if(result.success){
        this.notifier.notify("success", "Tag created successfully");  
        this.dialogRef.close(result.data);
      }else{
        this.notifier.notify("success", "Tag could not be created");  
      }
      
    })
  }

  existingTagSelected(event){
    this.tagId = event.tagId;
  }
}