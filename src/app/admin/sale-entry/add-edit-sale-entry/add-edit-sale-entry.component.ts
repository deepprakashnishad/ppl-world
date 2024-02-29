import { MediaMatcher } from '@angular/cdk/layout';
import { Component, ViewChild, Output, OnInit, Inject } from '@angular/core';
import { AdminService } from './../../admin.service';
import { NotifierService } from 'angular-notifier';
import { EmploymentService } from 'src/app/employment/employment.service';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {PersonExactMatchComponent} from 'src/app/person/person-exact-match-extra/person-exact-match.component';

@Component({
  selector: 'app-add-edit-sale-entry',
  templateUrl: './add-edit-sale-entry.component.html',
  styles: [".container: {overflow-y: auto}"]
})
export class AddEditSaleEntryComponent implements OnInit {

  amt: number; //Sale Amount
  exp: number=0; // Expenses
  com: number; // Commission
  distP: number; //Distribution Percentage
  b: string; //Buyer Id
  bd: any;
  ul: Array<string>=[];
  cats: Array<any> = [];
  storeName: string;
  storeId: string;
  selectedCategory: any;
  @ViewChild("buyerSearchBox") buyerSearchBox: PersonExactMatchComponent;

  constructor(
    private adminService: AdminService,
    private empService: EmploymentService,
    private authService: AuthenticationService,
    private notifier: NotifierService,
    private dialogRef: MatDialogRef<AddEditSaleEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    console.log(data.store);
    if(data.store.id){
      this.storeId = data.store.id;
    }
    if(data.store.t){
      this.storeName = data.store.t; 
    }
    if(data.store.cats){
      this.empService.getCategoryByIds(data.store.cats).subscribe(result=>{
        this.cats = result;
        this.selectedCategory = this.cats[0];
        this.com = this.selectedCategory.c;
        if(this.selectedCategory.exp && this.selectedCategory.exp>0){
          this.exp = this.selectedCategory.exp;
        }
      })
    }
  }

  ngOnInit(){}

  selectedCategoryUpdated(event){
    this.com = this.selectedCategory.c;
    if(this.selectedCategory.exp && this.selectedCategory.exp>0){
      this.exp = this.selectedCategory.exp;
    }
  }

  isAuthorized(permission){
    return this.authService.authorizeUser([permission]);
  }

  buyerSelected(event){
    if(event.person){
      this.bd = {n: event.person.n, id: event.person.id};
      if(event.person.ul && event.person.ul.length>0){
        this.ul = event.person.ul;
      }else{
        this.ul = [event.person.pd.id];
      }
    }    
    this.bd['m'] = event.mobile;
  }

  save(){
    this.adminService.addSaleEntry({amt: this.amt, exp: this.exp, com: this.com, 
      b: this.b, bd: this.bd, ul: this.ul, store: this.storeId, sn: this.storeName, t: this.selectedCategory.n })
    .subscribe(result=>{
      if(result.success){
        this.notifier.notify("success", result.msg);
        this.dialogRef.close(result);
        this.resetForm();
      }else{
        this.notifier.notify("error", result.msg);
      }
    });
  }

  resetForm(){
    this.amt = 0;
    this.buyerSearchBox.reset();
  }
}