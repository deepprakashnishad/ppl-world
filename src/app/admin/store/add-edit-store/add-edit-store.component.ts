import { Component, OnInit, Inject, Optional } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Store } from './../store';
import { StoreService } from './../store.service';
import { EmploymentService } from './../../../employment/employment.service';
import {GeneralService } from 'src/app/general.service';
import { AuthenticationService } from './../../../authentication/authentication.service';
// import { FileUploader, FileSelectDirective, FileItem } from 'ng2-file-upload/ng2-file-upload';
import { environment } from './../../../../environments/environment';
import { StoreSettings } from '../store-setting';
import { NotifierService } from 'angular-notifier';
import { AngularFireStorage } from '@angular/fire/storage';
import {Router} from '@angular/router';


@Component({
  selector: 'app-add-edit-store',
  templateUrl: './add-edit-store.component.html',
  styleUrls: ['./add-edit-store.component.scss'],
  animations: [
    trigger('selection', [
      state('selected', style({
        background: 'linear-gradient(to right, #2217c5, #0eeba4)',
        color: 'white'
      })),
      state('unselected', style({
        background: 'white',
        color: 'black'
      })),
      transition('selected => unselected', [
        animate('500ms')
      ]),
      transition('unselected => selected', [
        animate('500ms')
      ]),
    ])
  ]
})
export class AddEditStoreComponent implements OnInit {

  store: Store = new Store();
  uploadPath: string = "/logo.png";

	storeForm: FormGroup;
  title: string;

  categories: Array<any>=[];

  selectedCategories: any = {};
  selectedLang: string;
 
  constructor(
  	private storeService: StoreService,
    private notifier: NotifierService,
    private authenticationService: AuthenticationService,
    private afs: AngularFireStorage,
    private gService: GeneralService,
    private employmentService: EmploymentService,
    private router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) data: any,
    @Optional() private dialogRef: MatDialogRef<AddEditStoreComponent>
  ) { 
    if(data && data.store){
      this.store = data.store;
    }
  }

  ngOnInit() {
    this.fetchCategories();
    this.gService.selectedLanguage.subscribe(lang => {
      this.selectedLang = lang;
      this.updateDisplayName();
    });
    if(!this.store.id){
      this.storeService.getMyStores().subscribe(result => {
        if (result?.length>0) {
          this.store = Store.fromJSON(result[0]);
          this.selectCategoriesFromIds(this.store.cats);
        }      
      });
    }
  }

  navigateTo(url){
    this.router.navigate([url]);
  }

  addressSelected(event){
    this.store.address = event.id;
  }

  save() {
    if (this.store.id) {
      this.storeService.update(this.store).subscribe(result => {
        if (result['success']) {
          this.notifier.notify("success", "Store settings updated successfully");
          if(this.dialogRef){
            this.dialogRef.close(result['store']);
          }          
        }
      });
    } else {
      this.storeService.create(this.store).subscribe(result => {
        if (result['success']) {
          this.store.id = result['id'];
          this.notifier.notify("success", "Store settings updated successfully");
          if(this.dialogRef){
            this.dialogRef.close(result['store']);
          }
        }
      });
    }
  }

  uploadCompleted(event) {
    this.store.logo = event;
  }

  deleteImage(event) {
    this.afs.ref(event['uploadPath']).delete().subscribe(result => {
      console.log(result);
    }); 
  }

  samePersonUpdated(event){
    if(event){
      this.store.cp = this.authenticationService.getTokenOrOtherStoredData("name");
      this.store.cpc = this.authenticationService.getTokenOrOtherStoredData("mobile");
      this.store.cpe = this.authenticationService.getTokenOrOtherStoredData("email");
    }
  }

  fetchCategories(){
    this.employmentService.listCategory().subscribe(result=>{
      this.categories = result;
      if(this.store.cats){
        this.selectCategoriesFromIds(this.store.cats);
      }
      this.updateDisplayName();
    })
  }

  updateDisplayName(){
    var result = this.categories;
    if(this.selectedLang!=="en"){
      for(var i=0;i<result.length;i++){
        if(result[i]['cat'][0]['tr'][this.selectedLang]['b']){
          result[i]['dn'] = result[i]['cat'][0]['tr'][this.selectedLang]['b'];  
        }else{
          result[i]['dn'] = result[i]['_id'];
        }
        
        for(var j=0;j<result[i]['cat'].length;j++){
          if(result[i]['cat'][j]['tr'][this.selectedLang]['n']){
            result[i]['cat'][j]['dn'] = result[i]['cat'][j]['tr'][this.selectedLang]['n'];
          }else{
            result[i]['cat'][j]['dn'] = result[i]['cat'][j]['name'];
          }
        }
      }
    }else{
      for(var i=0;i<result.length;i++){
        result[i]['dn'] = result[i]['_id'];
        for(var j=0;j<result[i]['cat'].length;j++){
          result[i]['cat'][j]['dn'] = result[i]['cat'][j]['name'];
        }
      }
    }
    this.categories = result;
  }

  isCategorySelected(subCat){
    return Object.keys(this.selectedCategories).includes(subCat.id);
  }

  toggleSelection(subCat, base){
    if(this.isCategorySelected(subCat)){
      delete this.selectedCategories[subCat.id]
      var index = this.store.cats.indexOf(subCat.id);
      if(index >= 0){
        this.store.cats.splice(index, 1);
      }
    }else{
      this.selectedCategories[subCat.id] = {b: base, "subCat": subCat, key: subCat.id}
      this.store.cats.indexOf(subCat.id)<0? this.store.cats.push(subCat.id): console.log("Item is already present");
    }
  }

  getKeys(obj){
    var keys = Object.keys(obj);
    return keys;
  }

  selectCategoriesFromIds(catIds){
    var existingKeys = Object.keys(this.selectedCategories);
    for(var catId of catIds){
      if(existingKeys.indexOf(catId)<0){
        var data = this.getCategoryFromId(catId);
        this.toggleSelection(data['subCat'], data['b']);
      }
    }
  }

  getCategoryFromId(catId){
    for(var category of this.categories){
      for(var subCat of category.cat){
        if(subCat.id===catId){
          return {b: category._id, "subCat": subCat, key: catId}
        }
      }
    }
    return {b: "", "subCat": {}, key: catId}
  }
}