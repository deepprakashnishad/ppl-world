import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { EmploymentService } from './../../employment.service';
import { NotifierService } from 'angular-notifier';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-service-offer-editor',
  templateUrl: './service-offer-editor.component.html',
  styleUrls: ['./service-offer-editor.component.scss'],
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
export class ServiceOfferEditorComponent implements OnInit {

  categories: Array<any>=[];

  selectedCategories: any = {};

  selectedTabIndex: number = 0;

  constructor(
    private notifier: NotifierService,
    private employmentService: EmploymentService,
  ){}

  ngOnInit(){
    this.fetchCategories();
  }

  fetchCategories(){
    this.employmentService.listCategory().subscribe(result=>{
      this.categories = result;
    })
  }

  isCategorySelected(subCat){
    return Object.keys(this.selectedCategories).includes(subCat.id);
  }

  toggleSelection(subCat, base){
    if(this.isCategorySelected(subCat)){
      //Remove from selected List
      delete this.selectedCategories[subCat.id]
    }else{
      this.selectedCategories[subCat.id] = {b: base, "subCat": subCat}
      this.selectedTabIndex = Object.keys(this.selectedCategories).length;
    }
  }

  getKeys(obj){
    var keys = Object.keys(obj);
    return keys;
  }
}