import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MyIdbService, STORE_SETTINGS, TS_STORE } from "src/app/my-idb.service";
import { Category } from "../../../admin/category/category";
import { CategoryService } from "../../../admin/category/category.service";
import { CategoryTreeNode } from "../../../admin/category/CategoryTreeNode";
import { ShareComponent } from 'src/app/shared/share/share.component';
import { NotifierService } from 'angular-notifier';
import {
  MatBottomSheet
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { LeadsComponent } from 'src/app/static-page/store/leads/leads.component';

export const catRefreshDays = 30;
export const catRefreshTimeInMillis = catRefreshDays*24*60*60*1000;

@Component({
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"]
})
export class CategoriesComponent implements OnInit{

  nodes: Array<CategoryTreeNode> = [];

  displayedNodes: Array<CategoryTreeNode> = [];

  nodeNavigation: Array<Array<CategoryTreeNode>> = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private dbService: MyIdbService,
    private notifier: NotifierService,
    private cdr: ChangeDetectorRef,
    private _bottomSheet: MatBottomSheet,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.updateCategoryTree();
    /*this.dbService.getValue(STORE_SETTINGS, "CAT_TREE").then(res=>{
      this.nodes = res;
      if (!this.nodes) {
        this.updateCategoryTree(); 
      } else {
        this.displayedNodes.splice(0, this.displayedNodes.length);
        this.nodes.forEach(ele => {
          this.displayedNodes.push(ele);
        })
      }
    });
    this.dbService.getValue(TS_STORE, "CAT_TREE").then(res=>{
      if(res+catRefreshTimeInMillis<Date.now()){
        this.updateCategoryTree();
      }
    })*/
    /* if (!this.nodes) {
      this.categoryService.fetchCategoryTree(true).subscribe(result => {
        this.nodes = result;
        this.nodes.forEach(ele => {
          this.displayedNodes.push(ele);
        })
        sessionStorage.setItem("catTree", JSON.stringify(this.nodes));
        this.dbService.setValue(STORE_SETTINGS, {"CAT_TREE": this.nodes});
        this.dbService.setValue(TS_STORE, {"CAT_TREE": Date.now()})
      });
    } else {
      this.nodes.forEach(ele => {
        this.displayedNodes.push(ele);
      })
    } */
  }

  updateCategoryTree(){
    this.categoryService.fetchCategoryTree(true).subscribe(departments => {
      for(var department of departments){
        if(department.title==="Services" || department.title==="GoodAct-Services"){
          this.nodes = department.childrens;
        }
      }
      localStorage.setItem("cat-map", JSON.stringify(departments));
      this.displayedNodes.splice(0, this.displayedNodes.length);
      this.nodes.forEach(ele => {
        this.displayedNodes.push(ele);
      });
      /*sessionStorage.setItem("catTree", JSON.stringify(this.nodes));
      this.dbService.setValue(STORE_SETTINGS, {"CAT_TREE": this.nodes});
      this.dbService.setValue(TS_STORE, {"CAT_TREE": Date.now()})*/
    });
  }

  updateDisplayedCategories(categories) {
    this.displayedNodes = categories;
  }

  navigateToSubCat(node: CategoryTreeNode) {
    /*this.router.navigate(['/product-by-category'], { queryParams: node});
    return;*/
    if (node.childrens.length === 0) {
      this.router.navigate(['/product-by-category'], { queryParams: {ancestors: node.ancestors} });
    } else {
      this.nodeNavigation.push(this.displayedNodes);
      this.displayedNodes = node.childrens;
    }
  }

  backNavigation() {
    this.displayedNodes = this.nodeNavigation.pop();
  }

  openShareBottomSheet(event, node: CategoryTreeNode){
    if(!node){
      this.notifier.notify("error", "Try again in sometime.")
    }
    var mTxt = `Browse ${node.title} catalogue by GoodAct. It's a one stop solution for all your needs. ${environment.appUrl }/product-by-category?referrer=${encodeURIComponent(sessionStorage.getItem("m")?sessionStorage.getItem("m"):"")}`;
    this._bottomSheet.open(ShareComponent, {data: {"mTxt": mTxt, mTitle: `Share ${node.title} catalogue`}});
    event.stopPropagation();
  }

  call(event){
    this.router.navigate([]).then(result => {  window.open("tel: +917880873187", '_blank'); });
    event.stopPropagation();
  }

  openLeadsComponent(event, node: CategoryTreeNode){
    var dialogRef = this.dialog.open(LeadsComponent, {
        data: {
            "category": node.title,
            "details": {catId: node.id, catTitle: node.title, type: "category"}
        }
    });
    dialogRef.afterClosed().subscribe(result=>{
        console.log(result);
    });
    event.stopPropagation();
    return;
  }
}
