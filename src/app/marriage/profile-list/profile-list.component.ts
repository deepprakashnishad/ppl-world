import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MarriageService } from './../marriage.service';
import { NotifierService } from 'angular-notifier';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {AddressService} from 'src/app/shared/address/address.service';
import { GeneralService } from 'src/app/general.service';
import { Observable } from 'rxjs/Observable';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { MarriageProfile } from './../marriage';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styles: ['.btn-fab{position: absolute; right: 24px; bottom: 12px; z-index:100}'],
  animations: [
    trigger('selection', [
      state('selected', style({
        background: 'linear-gradient(to right, #2217c5, #0eeba4)',
        color: 'white'
      })),
      state('unselected', style({
        background: 'white',
        color: 'black'
      })),
      transition('selected => unselected', [
        animate('500ms')
      ]),
      transition('unselected => selected', [
        animate('500ms')
      ]),
    ])
  ]
})
export class ProfileListComponent implements OnInit {

  mps: Array<any> = [];

  profileOwner:string = "self";

  constructor(
    private marraigeService: MarriageService,
    private notifier: NotifierService,
    private generalService: GeneralService,
    private route: ActivatedRoute,
    private router: Router
  ){
  }

  ngOnInit(){
  	this.route.params.subscribe(params=>{
  		this.profileOwner = params['profileOwner'];
  		if(this.profileOwner && this.profileOwner === "self"){
  			this.marraigeService.listMyProfiles().subscribe(result=>{
		  		if(result.success){
		  			this.mps = result.data;	
		  		}else{
		  			this.notifier.notify("error", "Could not fetch images");
		  		}  		
		  	});
  		}else{
        this.marraigeService.listProfiles().subscribe(result=>{
          if(result.success){
            this.mps = result.data; 

            this.mps = this.mps.map(ele=>{
              if(ele['dob']){
                ele['age'] = this.generalService.calculatorAgeFromTimestamp(ele['dob']);  
              }
              return ele;
            });
          }else{
            this.notifier.notify("error", "Could not fetch images");
          }     
        });
  		}
  		
  	});
  	
  }

  navigateTo(url, id){
    if(id){
      this.router.navigate([url, id]);
    }else{
      this.router.navigate([url]);  
    }  	
  }
}