import { MediaMatcher } from '@angular/cdk/layout';
import { Component, ViewChild, ElementRef, HostBinding ,
  ChangeDetectorRef, OnDestroy, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditSaleEntryComponent } from './add-edit-sale-entry/add-edit-sale-entry.component';
import { AdminService } from './../admin.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-sale-entry-list',
  templateUrl: './sale-entry-list.component.html',
  styles: [".floating-button{position: absolute; bottom: 12px; right: 12px; }", ".container{max-width: 100%; overflow: auto}"]
})
export class SaleEntryListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['sno', 'sale_amt', 'buyer', 'total_commission', 'expense', 'distribution', 'status', 'actions'];
  dataSource: MatTableDataSource<any>;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  saleList: Array<any> = [];
  totalSaleCnt: number = 0;

  pageSize: number=10;

  selectedPage:  number = 1;

  salesByPage: any = {};

  constructor(
    public dialog: MatDialog,
    private adminService: AdminService
  ){}

  ngOnInit(){
    this.fetchSaleEntries();
  }

  ngAfterViewInit(){
    this.dataSource = new MatTableDataSource<any>(this.saleList);
    this.dataSource.paginator = this.paginator;
  }

  fetchSaleEntries(){
    this.adminService.listSaleEntries(this.selectedPage-1, this.pageSize).subscribe(result => {
      this.totalSaleCnt = result[0].metadata && result[0].metadata.length>0?result[0].metadata[0]['totalCount']:0;
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
    const dialogRef = this.dialog.open(AddEditSaleEntryComponent);

    dialogRef.afterClosed().subscribe(result=>{
      console.log(result);
    })
  }
}