import { Component, OnInit, Inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { StoreService } from './../store.service';
import { PersonService } from './../../../person/person.service';
import { AddressService } from 'src/app/shared/address/address.service';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { NotifierService } from 'angular-notifier';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
    details: any;
    isLoggedIn: boolean = false;

    constructor(
        private storeService: StoreService,
        private personService: PersonService,
        private addressService: AddressService,
        private authenticationService: AuthenticationService,
        private notifier: NotifierService,
        private dialogRef: MatDialogRef<LeadsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {

        this.authenticationService.isLoggedIn.subscribe(res=>{
            this.isLoggedIn = res;
            this.referrerId = sessionStorage.getItem("id");
        })

        if(data.category){
            this.category = data.category;
        }

        if(data.details){
            this.details = data.details;
        }
    }

    ngOnInit() {
      
    }

    referrerSelected(event){
        this.referrerId = event.id;
    }

    save(){
        if(!this.name){
            this.notifier.notify("error", "Buyer name is required");
            return;
        }

        if(!this.mobile){
            this.notifier.notify("error", "Buyer mobile is required");
            return;
        }
        this.storeService.saveLead(
        {
            c: this.category, 
            r: this.referrerId, 
            n: this.name, 
            m: this.mobile, 
            p: this.pincode, 
            ar: this.area,
            ci: this.city, 
            st: this.state,
            des: this.details
        }).subscribe(result=>{
            if(result.success){
                this.notifier.notify("success", "Thank you for sharing contact. Lead successfully registered.")
                this.notifier.notify("success", "We will contact them within 24 hrs");
                this.dialogRef.close();
            }else{
                this.notifier.notify("error", "Failed to register. Please try again.");
            }
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