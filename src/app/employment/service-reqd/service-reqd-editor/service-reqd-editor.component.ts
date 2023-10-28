import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import {AuthenticationService} from './../../../authentication/authentication.service';
import { EmploymentService } from './../../employment.service';
import { NotifierService } from 'angular-notifier';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {AddressService} from './../../../shared/address/address.service';
import { GeneralService } from '../../../general.service';
import { MyIdbService, TAG } from 'src/app/my-idb.service';
import {ServiceRequirement} from './../../employment';
import { Observable } from 'rxjs/Observable';
import { map, startWith, switchMap, filter } from 'rxjs/operators';


@Component({
  selector: 'app-service-reqd-editor',
  templateUrl: './service-reqd-editor.component.html',
  styleUrls: ['./service-reqd-editor.component.scss'],
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
export class ServiceReqdEditorComponent implements OnInit {

  selectedLanguage: string = "en";

  selectedCategory: string='st';

  workDomains: Array<any>=[];

  filteredWorkDomains: Observable<any[]>;

  selectedWorkDomain: any;

  selectedWorkDomainId: string;

  availableAreas: Array<string> = [];

  sr: ServiceRequirement = new ServiceRequirement();

  skills: any = {};

  catCntl: FormControl;

  constructor(
    private employmentService: EmploymentService,
    private notifier: NotifierService,
    private addressService: AddressService,
    private authenticationService: AuthenticationService,
    private generalService: GeneralService,
    private idbService: MyIdbService
  ){
    this.sr.cn = this.authenticationService.getTokenOrOtherStoredData("name");
    this.sr.cm = this.authenticationService.getTokenOrOtherStoredData("mobile");
    this.sr.ce = this.authenticationService.getTokenOrOtherStoredData("email");

    this.catCntl = new FormControl();
  }

  ngOnInit(){
    this.fetchCategories();
  }

  workDomainSelected(selectedWorkDomain){
    this.selectedWorkDomainId = selectedWorkDomain.id;
    this.sr.wc = selectedWorkDomain;
    if(!Object.keys(this.skills).includes(this.sr.wc)){
      /*this.idbService.getAll(TAG).then(result=>{
        this.skills[selectedWorkDomain.id] = this.idbService.sanitizeByKey(this.selectedWorkDomainId, result);
      })
      console.log(this.skills);*/
      this.generalService.getTags(this.selectedWorkDomainId).subscribe(result=>{
        if(result.length>0){
          this.skills[selectedWorkDomain.id] = result;  
        }else{
          this.skills[selectedWorkDomain.id] = [];
        }        
      });
    }
  }

  subscribeInput(){
    this.filteredWorkDomains = this.catCntl.valueChanges.pipe(
    startWith(''),
    map((filterStr: string) => {
      var temp = Object.values(this.workDomains);
      return this._filterWorkDomains(filterStr, temp);
    }));
  }

  _filterWorkDomains(value:string, domains: Array<any>): Array<any>{
    var list = [];
    if(domains && value && typeof value==="string" && value.length>0){
        const filterValue = value.toLowerCase();
        for(var i=0;i<domains.length;i++){
          list[i] = {};
          list[i]["_id"] = domains[i]['_id'];
          list[i]['cat'] = Array.from(domains[i]['cat'].filter(option=>{
            return option["name"].toLowerCase().includes(filterValue);           
          }));
        }

        list = list.filter(ele=>ele.cat.length>0);
        return list;
    } else if(domains){
      return domains;
    }
  } 

  workTypeSelected(workType){
    this.sr.wt = workType;
    if(workType==="st"){    
      this.sr.st = "o";
    }else if(workType==="wb"){
      this.sr.st = "p";
    }else if(workType==="cs"){
      this.sr.st = "m";
    }else if(workType==="ps"){
      this.sr.st = "m";
    }
  }

  fetchCategories(){
    this.employmentService.listCategory().subscribe(result=>{
      this.workDomains = result;
      this.subscribeInput()
    })
  }

  getPincodeDetail() {
    if (!this.sr.pc.match("^[0-9]{6,6}$")) {
      this.notifier.notify("error", "Invalid pincode");
      return;
    }
    
    this.addressService.getPincodeDetail(this.sr.pc).subscribe(result=>{
     if(result[0]['Status']==='Success'){
       var postOffices = result[0]['PostOffice'];
       this.sr.st = postOffices[0]['State'];
       this.sr.c = postOffices[0]['Country'];
       this.sr.ci = postOffices[0]['District'];

       this.availableAreas = postOffices.map(ele=>ele.Name)
     }
    });
  }

  locationSelected(event, type){
    if(type==='location_type'){
      this.sr.wlt = event;
    }else{
      this.sr.lpt = event;
    }
  }

  areaSelected(event){
    this.sr.ar = event;
  }

  saveWorkRequirement(){
    this.employmentService.createServiceRequirement(this.sr).subscribe(result=>{
      if(result.success){
        this.sr = ServiceRequirement.fromJSON(result);
        this.notifier.notify("success", "Project details updated successfully");
      }else{
        this.sr = ServiceRequirement.fromJSON(result);
        this.notifier.notify("error", "Failed to update project details");
      }
    })
  }

  displayFn(cat: any): string {
    return cat && cat.name ? cat.name : '';
  }

  selectedTagModified(event){
    this.sr.ss = event.map(ele=> ele.tid);
  }
}