import { Component, OnInit, Inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { StoreService } from './../store.service';
import { PersonService } from './../../../person/person.service';
import { AddressService } from 'src/app/shared/address/address.service';
import { NotifierService } from 'angular-notifier';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styles: [".prod-card{max-width: 250px; cursor: pointer; margin: 12px;} .bContainer:{}"],
})
export class LeadsComponent implements OnInit {

    category: string;
    referrerId: string;
    name: string;
    mobile:string;
    pincode: string;
    city: string;
    state: string;
    area: string;
    availableAreas: Array<string> = [];

    constructor(
        private storeService: StoreService,
        private personService: PersonService,
        private addressService: AddressService,
        private notifier: NotifierService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
       console.log(data); 

        if(data.category){
            this.category = data.category;
        }
    }

    ngOnInit() {
      
    }

    referrerSelected(event){
        
    }

    save(){
        this.storeService.saveLead(
        {
            c: this.category, 
            r: this.referrerId, 
            n: this.name, 
            m: this.mobile, 
            p: this.pincode, 
            ar: this.area,
            ci: this.city, 
            st: this.state
        }).subscribe(result=>{
            console.log(result);
        });
    }

    getPincodeDetail() {
        if (!this.pincode.match("^[0-9]{6,6}$")) {
          this.notifier.notify("error", "Invalid pincode");
          return;
        }
        
        this.addressService.getPincodeDetail(this.pincode).subscribe(result=>{
            if(result[0]['Status']==='Success'){
                var postOffices = result[0]['PostOffice'];
                this.state = postOffices[0]['State'];
                this.city = postOffices[0]['District'];

                this.availableAreas = postOffices.map(ele=>ele.Name)
            }
        });
    }

    areaSelected(event){
        this.area = event;
    }
}