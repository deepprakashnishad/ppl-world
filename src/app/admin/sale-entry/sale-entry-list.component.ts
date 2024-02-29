import { MediaMatcher } from '@angular/cdk/layout';
import { Component, ViewChild, ElementRef, HostBinding ,
  ChangeDetectorRef, OnDestroy, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditSaleEntryComponent } from './add-edit-sale-entry/add-edit-sale-entry.component';
import { AdminService } from './../admin.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NotifierService } from "angular-notifier";

@Component({
  selector: 'app-sale-entry-list',
  templateUrl: './sale-entry-list.component.html',
  styles: [".floating-button{position: absolute; bottom: 12px; right: 12px; }", ".container{max-width: 100%; overflow: auto}"]
})
export class SaleEntryListComponent implements OnInit, AfterViewInit {

  displayedColumns: Array<string> = ['sno', 'sale_amt', 'buyer', 'total_commission', 'expense', 'distribution', 'status', 'actions'];
  dataSource: MatTableDataSource<any>;

  @ViewChild('paginator') paginator: MatPaginator;
  saleList: Array<any> = [];
  totalSaleCnt: number = 0;

  pageSize: number=5;

  selectedPage:  number = 1;

  salesByPage: any = {};

  selectedStore: any;

  constructor(
    public dialog: MatDialog,
    private adminService: AdminService,
    private notifier: NotifierService
  ){}

  ngOnInit(){
  }

  ngAfterViewInit(){
    this.dataSource = new MatTableDataSource<any>(this.saleList);
    this.dataSource.paginator = this.paginator;
  }

  storeSelectionModified(event){
    this.selectedStore = event;
    this.fetchSaleEntries();
  }

  fetchSaleEntries(){
    this.adminService.listSaleEntries(this.selectedStore.id, this.selectedPage-1, this.pageSize).subscribe(result => {
      this.totalSaleCnt = result[0].metadata && result[0].metadata.length>0?result[0].metadata[0]['totalCount']:0;
      result[0].data = result[0].data.map((item, index) => {
        item['sno'] = ((this.selectedPage-1)*this.pageSize) + index + 1;
        return item;
      });
      this.salesByPage[this.selectedPage-1] = result[0].data;
      this.prepareFinalProductList(result[0].data);
    });
  }

  pageUpdated(event){
    if(this.pageSize != event.pageSize){
      this.pageSize = event.pageSize;
    }
    this.selectedPage = event.pageIndex + 1;
    if(Object.keys(this.salesByPage).indexOf((this.selectedPage-1).toString())<0){
      this.fetchSaleEntries();
    }
  }

  reset(){
    this.saleList=[];
    this.salesByPage={};
  }

  prepareFinalProductList(data){
    if(!this.saleList || this.saleList.length===0){
      this.saleList = new Array(this.totalSaleCnt).fill({});
    }
    var cnt=0;
    data.forEach(ele=>{
      this.saleList[(this.selectedPage-1)*this.pageSize + cnt] = ele;
      cnt++;
    });
    this.dataSource.data = this.saleList;
  }

  openSaleEntryEditorDialog(){
    const dialogRef = this.dialog.open(AddEditSaleEntryComponent, {
      data: {store: this.selectedStore}
    });

    dialogRef.afterClosed().subscribe(result=>{
      /*if(result.success){
        this.salesByPage[this.selectedPage-1].push(result.sale);
      }*/
    })
  }

  updateSaleStatus(sale, fullListIndex, pageIndex, status){
    this.adminService.updateSaleStatus(sale._id, status).subscribe(result=>{
      if(result.success){
        // this.saleList[fullListIndex].s = status;
        if(status==="F"){
          var pages = Object.keys(this.salesByPage);
          for(var page of pages){
            this.salesByPage[page] = this.salesByPage[page].map(ele=>{
              if(ele['s']==="S"){
                ele['s'] = status;  
              }
              
              return ele;
            });
          }
        }else{
          this.salesByPage[this.selectedPage-1][pageIndex].s = status;  
        }
        this.notifier.notify("success", result['msg']);
      }else{
        this.notifier.notify("error", result['msg']);
      }
    });
  }

  edit(sale, index){

  }

  cancel(sale, index){

  }
}