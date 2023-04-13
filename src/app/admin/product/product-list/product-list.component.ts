import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { ProductService } from './../product.service';
import { PriceService } from './../price.service';
import { Product } from './../product';
import { NotifierService } from 'angular-notifier';
import { StorageService } from '../../../storage.service';
import { Store } from '../../store/store';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {

  displayedColumns: string[] = ['name', 'price', 'discountPercent','salePrice','qty', 'attr', 'status', 'actions', 'select'];
  dataSource: MatTableDataSource<Product>;

  selection = new SelectionModel<Product>(true, []);

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('fileInput') fileInput;
  csvContent: string;

  productList: Array<Product> = [];
  storeSettings = JSON.parse(sessionStorage.getItem("storeSettings"));

  selectedStore: Store = new Store();

  catmap = JSON.parse(localStorage.getItem("cat-map"));

  totalProductCount: number;
  pageSize: number = 25;

  modifiedPriceInventories: any={};
  searchStr: string = "";

  constructor(
  	private productService: ProductService,
    private priceService: PriceService,
    private notifier: NotifierService,
    private storageService: StorageService
  ) {
    if (!this.storeSettings?.isBrandEnabled) {
      this.displayedColumns.splice(1, 1);
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.getTotalProductCount();
    if(!this.productList || this.productList.length===0){
      this.fetchStoreProducts(0);
    }
  }

  getUnitQtyDiscount(discounts){
    if(discounts===undefined ||discounts===null){
      return;
    }
    for(var discount of discounts){
      if(discount.minQty===1){
        return discount;
      }
    }
    return discounts[0];
  }

  getTotalProductCount(){
    if(this.selectedStore?.id==undefined || this.selectedStore?.id==null){
      return;
    }
    this.productService.getStoreProductCount(this.selectedStore.id).subscribe(result=>{
      this.totalProductCount = result['count'];
    });
  }

  updatePriceInventory(value, field, element, index){
    var priceInventory = element.prices[0];

    if(field==="STATUS"){
      priceInventory['status'] = value;
    }else if(field==="QTY"){
      priceInventory['qty'] = +value;
    }else if(field==="UNIT_PRICE"){
      priceInventory['unitPrice'] = +(value);
      for(var i=0; i<priceInventory?.discounts?.length; i++){
        priceInventory.discounts[i].discount = +((priceInventory.discounts[i].discountPercentage*value)/100).toFixed(1);
        priceInventory.discounts[i].salePrice = +(value - priceInventory.discounts[i].discount).toFixed(1);
      }
    }else if(field==="MAX_ALLWD_QTY"){
      priceInventory['maxAlldQty'] = +value;
    }
    this.modifiedPriceInventories[element.prices[0].id] = priceInventory;
    this.productList[index]['prices'][0] = priceInventory;
    this.dataSource = new MatTableDataSource<Product>(this.productList)
  }

  salePriceCalculator(value, field, element, index){
    var priceInventory = element.prices[0];
    var discounts = priceInventory.discounts;
    if(discounts===undefined ||discounts===null || discounts.length===0){
      discounts = [];
      var selectedDiscount = {"minQty":1, "status": true};
      var selectedDiscountIndex=-1;
    }else{
      var selectedDiscount = {"minQty":1, "status": true};
      for(var i=0;i<discounts.length;i++){
        if(discounts[i].minQty===1){
          selectedDiscountIndex=i;
          selectedDiscount = discounts[i];
        }
      }
    }
    if(field==="SALE_PRICE"){
      selectedDiscount['salePrice'] = +value;
      selectedDiscount['discount'] = +(priceInventory.unitPrice-value).toFixed(0);
      selectedDiscount['discountPercentage'] = 
        +((selectedDiscount['discount']/(priceInventory.unitPrice))*100).toFixed(1);
    }else if(field==="DISCOUNT_PERCENT"){
      selectedDiscount['discountPercentage'] = +parseFloat(value).toFixed(1);
      selectedDiscount['discount'] = +((value*priceInventory.unitPrice)/100).toFixed(1);
      selectedDiscount['salePrice'] = +(priceInventory.unitPrice-selectedDiscount['discount']).toFixed(1);
    } 

    if(selectedDiscountIndex===-1){
      discounts.push(selectedDiscount);
    }else{
      discounts[selectedDiscountIndex] = selectedDiscount;
    }
    element.prices[0].discounts = discounts;
    this.productList[index] = element;
    this.dataSource = new MatTableDataSource<Product>(this.productList)
    this.modifiedPriceInventories[element.prices[0].id] = element.prices[0];
  }

  updatePriceQuantity(){
    this.priceService.bulUpdateInventoryList(this.modifiedPriceInventories).subscribe(result=>{
      if(result['success']){
        this.notifier.notify("success", "Inventory updated successfully");
        this.modifiedPriceInventories = {};
      }else{
        this.notifier.notify("error", "Failed to update inventory");
      }
    });
  }

  fetchStoreProducts(offset: number){
    if(this.selectedStore?.id==undefined || this.selectedStore?.id==null){
      return;
    }
    this.productService.getProductsByStoreId(this.selectedStore.id, offset, 
      this.pageSize, this.searchStr).subscribe(products => {
      if(offset===0){
        this.productList = products;
      }else{
        this.productList.push(...products);
      }
      
      this.dataSource = new MatTableDataSource<Product>(this.productList)
      this.dataSource.filterPredicate = ((item, filter):boolean=>{
        return item.name.toLowerCase().includes(filter) || 
          item.brand?.sname?.includes(filter) ||
          item.lname?.toLowerCase().includes(filter)
      })
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'name': return item.name;
          default: return item[property];
        }
      };
      this.dataSource.sort = this.sort;
    });
  }

  exportStoreProducts(){
    if(this.selectedStore?.id==undefined || this.selectedStore?.id==null){
      return;
    }
    this.productService.getProductsByStoreId(this.selectedStore.id, 0, 5).subscribe(products => {
      console.log(products);
    });
  }

  getTaxonomy(taxonomies: Array<string>){
    var result=[]
    if(taxonomies!==undefined && taxonomies!==null){
      taxonomies.forEach(tEle=>{
        result.push(tEle.split("/").map(cEle=>this.catmap['catMap'][cEle]).join("/"));
      })
      return result;
    }
    return "";
  }

  sortData(sort: MatSort) { this.dataSource.sort = this.sort; }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    /*if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }*/
  }

  selectionToggle(event, product: Product){
    if(event.checked && product.assets?.imgs?.length<1){
      this.notifier.notify("error", "Product images are missing");
      return;
    }

    if((event.checked && product.status.toLowerCase()==="active") || 
      (!event.checked && product.status.toLowerCase()==="inactive")){
        return;
    }
    product.status = event.checked?"Active":"Inactive";
    this.productService.updateProduct(product).subscribe(result=>{
      if(result['success']){
        this.notifier.notify("success", `${product.name} status changed to ${product.status}`);
      }
    });
  }

  delete(product: Product){
    this.productService.deleteProduct(product.id).subscribe(result=>{
      if(result['success']){
        this.notifier.notify("success", "Product deleted successfully");
      }else{
        this.notifier.notify("error", "Product could not be deleted");
      }
    });
  }

  storeSelectionModified(event){
    this.selectedStore = event;
    if(!this.productList || this.productList.length===0){
      this.getTotalProductCount();
      this.fetchStoreProducts(0);
    }
  }

  loadMoreProducts(){
    console.log("Hari Hari")
    this.fetchStoreProducts(this.productList.length-1);
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(input: HTMLInputElement): void {
    const files: File[] = this.fileInput.nativeElement.files;
    var exisitingProductList = [];
    var newProductList = [];
    if(files && files.length > 0) {
      let file : File = files[0]; 
      //File reader method
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let csv: any = reader.result;
        let allTextLines = [];
        allTextLines = csv.split(/\r|\n|\r/);
      
        // Table Rows
        let tarrR = [];
        
        let arrl = allTextLines.length;
        for(let i = 1; i < arrl; i++){
          if(allTextLines[i].length > 0){
            console.log(allTextLines[i]);
          }
        }
        /* this.productService.bulkUploadProducts(products).subscribe((result)=>{
          this.notifier.notify("success", "Data updates successfully");
        }); */
      }
    }  
  }

  searchItemSelected(selectedItem){
    console.log(selectedItem);
  }
}
