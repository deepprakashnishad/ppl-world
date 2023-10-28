import { AfterViewInit, Component, OnInit, SimpleChange, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl} from '@angular/forms';
import { NotifierService } from 'angular-notifier';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-location-coordinates',
  templateUrl: './location-coordinates.component.html',
  styleUrls: []
})
export class LocationCoordinatesComponent implements OnInit {

  @Input("autoFetch") autoFetch: boolean = false;

  @Input("lngLat") lngLat: any;

  @Output("locationSelected") locationSelected: EventEmitter<any> = new EventEmitter();

  lng: number;
  lat: number;

  showResetLoc: boolean = true;

  constructor(){}

  ngOnInit(){
    if(this.autoFetch){
      this.getLocation();
    }
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    for (let propName in changes) {
      let changedProp = changes[propName];
      console.log(propName);
      console.log(changedProp);
      if(propName.toLowerCase() === "autofetch" && changedProp.currentValue){
        this.getLocation();
      }else if(propName.toLowerCase() === "lnglat" && changedProp.currentValue){
        this.lng = this.lngLat[0];
        this.lat = this.lngLat[1];

        console.log(this.lngLat)
      }
    }
  }

  getLocation() {
    this.showResetLoc = false;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          if (position) {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;

            this.locationSelected.emit({t: "Point", ll: [this.lng, this.lat]});
          }
          this.showResetLoc = true;
        },
        (error) => {console.log(error);this.showResetLoc = true;},
        {enableHighAccuracy: true}
      );
    } else {
      this.showResetLoc = true;
      alert("Geolocation is not supported by this browser.");
    }
  }
}