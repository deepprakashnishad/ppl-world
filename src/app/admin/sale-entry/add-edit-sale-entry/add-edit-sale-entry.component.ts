import { MediaMatcher } from '@angular/cdk/layout';
import { Component, ViewChild, ElementRef, HostBinding ,
  ChangeDetectorRef, OnDestroy, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { AdminService } from './../../admin.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-add-edit-sale-entry',
  templateUrl: './add-edit-sale-entry.component.html',
  styles: [".container: {overflow-y: auto}"]
})
export class AddEditSaleEntryComponent implements OnInit {

  amt: number; //Sale Amount
  exp: number; // Expenses
  com: number; // Commission
  distP: number; //Distribution Percentage
  b: string; //Buyer Id
  bd: any;
  ul: Array<string>=[];;

  constructor(
    private adminService: AdminService,
    private notifier: NotifierService
  ){}

  ngOnInit(){}

  buyerSelected(event){
    console.log(event);
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
      b: this.b, bd: this.bd, ul: this.ul})
    .subscribe(result=>{
      if(result.success){
        this.notifier.notify("success", result.msg);
        this.resetForm();
      }else{
        this.notifier.notify("error", result.msg);
      }
    });
  }

  resetForm(){
    this.amt = 0;
    this.exp = 0;
    this.com = 0;
    this.distP = 0;
  }
}