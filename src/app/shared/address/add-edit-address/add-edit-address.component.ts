import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Address } from '../address';
import { AddressService } from '../address.service';

@Component({
  selector: 'app-add-edit-address',
  templateUrl: './add-edit-address.component.html',
  styleUrls: ['./add-edit-address.component.scss']
})
export class AddEditAddressComponent implements OnInit, AfterViewInit {

  address: Address = new Address();

  addressForm: FormGroup;

  availableAreas: Array<string> = [];

  lat: number;
  lng:number;

  showResetLoc: boolean = true;

  autoFetchCoordinates: boolean = false;

  latLng: any;

  constructor(
    private addressService: AddressService,
    private fb: FormBuilder,
    private notifier: NotifierService,
    public dialofRef: MatDialogRef<AddEditAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Address
  ) { 
    var mob = sessionStorage.getItem("mobile");
    if(mob){
      this.address.mb = mob;
    }
  }

  ngOnInit() {
    if(this.data && this.data!==null){
      this.address = this.data;
      if(this.address.loc && this.address.loc.ll){
        this.latLng = this.address.loc.ll;
        
        this.autoFetchCoordinates = false;
      }else{
        this.autoFetchCoordinates = true;
      }
    }else{
      this.autoFetchCoordinates = true;
    }

    this.addressForm = this.fb.group({
      cntlName: [this.address.n],
      cntlLine1: [this.address.al],
      cntlState: [this.address.s, Validators.required],
      cntlCity: [this.address.ci, Validators.required],
      cntlPincode: [this.address.pc, Validators.required],
      cntlLandmark: [this.address.lm],
      cntlCountry: [this.address.c],
      cntlMob1: [this.address.mb, Validators.required]
    });
  }

  ngAfterViewInit(){
  }

  save() {
    var pincodeMatches = this.address.pc.match("[0-9]{6}");
    var mob1Matches = this.address.mb.toString().match("^[6-9][0-9]{9}$");
    if (!pincodeMatches || pincodeMatches?.length === 0 ||
      pincodeMatches[0] !== this.address.pc) {
      this.notifier.notify("error", "Invalid pincode");
      return;
    }
    if (!mob1Matches || mob1Matches?.length === 0 ||
      mob1Matches[0] !== this.address.mb.toString()) {
      this.notifier.notify("error", "Invalid mobile number");
      return;
    }

    if (this.address !== null && this.address?.id) {
      this.addressService.update(this.address).subscribe(result => {
        if (result['success']) {
          this.dialofRef.close({ success: true, address: Address.fromJSON([result['address']])[0] });
        }
      })
    } else {
      this.addressService.add(this.address).subscribe(result => {
        if (result['success']) {
          this.dialofRef.close({ success: true, address: Address.fromJSON([result['address']])[0] });
        }
      });
    }
  }

  close(){
    this.dialofRef.close({result: false});
  }

  getPincodeDetail() {
    if (!this.address.pc.match("^[0-9]{6,6}$")) {
      this.notifier.notify("error", "Invalid pincode");
      return;
    }
    
    this.addressService.getPincodeDetail(this.address.pc).subscribe(result=>{
     if(result[0]['Status']==='Success'){
       var postOffices = result[0]['PostOffice'];
       this.address.s = postOffices[0]['State'];
       this.address.c = postOffices[0]['Country'];
       this.address.ci = postOffices[0]['District'];

       this.availableAreas = postOffices.map(ele=>ele.Name)

       console.log(this.availableAreas);
     }
    });
  }

  locationSelected(event){
    this.address.loc = event;
  }

  /*getLocation() {
    this.showResetLoc = false;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
          console.log("Latitude: " + position.coords.latitude +
            "Longitude: " + position.coords.longitude);
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;

          this.address.loc = {type: "Point", coordinates: [this.lng, this.lat]}
        }
        this.showResetLoc = true;
      },
        (error) => {console.log(error);this.showResetLoc = true;});
    } else {
      this.showResetLoc = true;
      alert("Geolocation is not supported by this browser.");
    }
  }
*/
  areaSelected(event){
    this.address.ar = event;
  }
}
