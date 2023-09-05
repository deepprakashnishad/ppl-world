import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { EmploymentService } from './../employment.service';
import { NotifierService } from 'angular-notifier';
import { GeneralService } from '../../general.service';
import { MyIdbService, TAG } from 'src/app/my-idb.service';
import {ServiceRequirement} from './../employment';
import { Observable } from 'rxjs/Observable';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-service-category-editor',
  templateUrl: './service-category-editor.component.html',
  styles: [".floating-action-button{position: absolute; bottom: 24px;right: 24px;}"]
})
export class ServiceCategoryEditorComponent implements OnInit {

  categories: Array<any> = [];

  displayedColumns: string[] = ['pic', 'n', 'b','actions'];

  dataSource: MatTableDataSource<any>;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selectedLang: string = "hi";

  langs = environment.langs;

  sc: any = {'tr':{'hi': {}}};

  uploadPath: string;

  selectedIndex: number = -1;

  constructor(
    private employmentService: EmploymentService,
    private notifier: NotifierService,
    private generalService: GeneralService,
    private idbService: MyIdbService
  ){
  }

  ngOnInit(){
    this.fetchCategories();
  }

  sortData(sort: MatSort) { 
    var categories = this.categories.sort(function(a, b) {
      var keyA = a[sort['active']],
      keyB = b[sort['active']];
      /*if(sort['active']==="bp" || sort['active']==="m"){
        keyA = keyA['name'];
        keyB = keyB['name'];
      }*/
      if(sort['direction']==="asc"){
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
      }else if(sort['direction']==="desc"){
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
      }
      return 0;
    });
    this.dataSource.data = categories; 
  }

  fetchCategories(){
    this.employmentService.listCategoryRawFormat().subscribe(result=>{
      this.categories = result;
      this.dataSource = new MatTableDataSource<any>(this.categories);
    })
  }

  /*delete(c, i){
    this.employmentService.deleteCategory(c.id).subscribe(result=>{
      if(result['success']){
        this.notifier.notify("success", `${c.n} deleted successfully`);
        this.categories.splice(i, 1);
        this.dataSource.data = this.categories;
      }
    });
  }*/

  edit(c, i){
    this.sc = c;
    this.selectedIndex = i;
    this.uploadPath = `category`;
  }

  updateLanguage(event){
    if(!this.sc['tr'][this.selectedLang]){
      this.sc['tr'][this.selectedLang] = {};
    }
  }

  imageUploaded(event){
    this.sc.img = event;                                                      
  }

  save(){
    this.employmentService.saveCategory(this.sc).subscribe(result=>{
      if(result['success']){
        if(this.selectedIndex===-1){
          this.categories.push(this.sc);
        }else{
          this.categories[this.selectedIndex] = this.sc;
        }
      this.dataSource.data = this.categories;
        this.notifier.notify("success", "Category updated successfully");
      }else{
        this.notifier.notify("error", "Could not save category");
      }      
    });
  }
}