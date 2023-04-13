import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from 'src/app/shoppin/order/order.service';
import { MyIpcService } from 'src/app/admin/my-ipc.service';

@Component({
  selector: 'app-sale-reciept-dialog',
  templateUrl: './sale-reciept-dialog.component.html',
  styleUrls: ['./sale-reciept-dialog.component.scss']
})
export class SaleRecieptDialogComponent implements OnInit {

  order: any;
  customer: any;
  store: any;

  constructor(
    private myIpcService: MyIpcService,
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) data: any
  ) { 

    if(data?.person){
      this.customer = data.person;
    }
  
    if(data?.order){
      this.order = data.order;
    }

    if(data?.store){
      this.store = data.store;
    }
  }

  ngOnInit() {
  }

  print(printContentId: string) {
      var divContents = document.getElementById(printContentId).innerHTML;
      var a = window.open('', '', 'height=1, width=1');
      a.document.write('<html>');
      a.document.write('<body style="max-width:300px; font-size:12px">');
      a.document.write(divContents);
      a.document.write('</body></html>');
      a.document.close();
      setTimeout(function () { a.print(); }, 500);
      a.onfocus = function () { setTimeout(function () { a.close(); }, 500); }
    }

  getTotalByMRP(){
    if(this.order?.items){
      return this.orderService.getTotalByMRP(this.order?.items);     
    }
  }

  getTotalCost(){
    if(this.order?.items){
      return this.orderService.getTotalCost(this.order?.items);     
    }
  }

  getTotalSavings(){
    if(this.order?.items){
      return this.orderService.getTotalSavings(this.order?.items);
    }
  }

  convertToDate(timestamp){
    var date = new Date(timestamp);
    return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear() + " " + date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  }
}
