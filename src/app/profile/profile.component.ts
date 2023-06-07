import { 
  Component, 
  OnInit, 
} from '@angular/core';
import {FormControl} from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ProfileService } from './profile.service';
import { Person } from  './../person/person';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  person: Person = new Person();
  keys: Array<string> = [];
  maxChildOrbit: number = 0;

  selectedPersonForApproval: any;
  joiningCharges: number = environment.joiningCharges;

  uploadPath: string = "";

  order: any;


  constructor(
    private profileService: ProfileService,
    private notifier: NotifierService
  ){
    
  }

  ngOnInit(){
    this.profileService.getPersonDetail().subscribe(result=>{
      this.person = Person.fromJSON(result);
      this.order = {
          amount: environment.joiningCharges, 
          person: this.person.id, 
          product: "Starter Plan Activation"
        }
      if(this.person.status==="APPROVAL_PENDING" && this.person.currOrbit===0){
        this.order = {
          amount: environment.joiningCharges, 
          person: this.person.id, 
          product: "Starter Plan Activation"
        }
      }

      this.uploadPath = this.person.id;
      
      this.keys = Object.keys(this.person.lwdlc);
      for(var i=0;i < this.keys.length;i++){
        var currLevel = this.keys[i];
        var clKeys = Object.keys(this.person.lwdlc[currLevel]);
        if(clKeys.length > this.maxChildOrbit){
          this.maxChildOrbit = clKeys.length-1;
        }
      }
    });
  }

  newPersonSelected($event){
    this.selectedPersonForApproval = $event;
  }

  approve(){
    if(this.person.amtWithdrawable < this.joiningCharges){
      this.notifier.notify("error", `Insufficient balance. ${this.joiningCharges - this.person.amtWithdrawable} more is required.`);
    }else if(this.selectedPersonForApproval.s !== "APPROVAL_PENDING"){
      this.notifier.notify("error", `${this.selectedPersonForApproval.n} is already joined`);
    }else{
      this.profileService.approveNewJoinee(
        this.selectedPersonForApproval.id, this.joiningCharges
      ).subscribe(result=>{
        console.log(result);
      });
    }
  }

  uploadCompleted(event, type){
    this.profileService.updateProfileImages(event, type).subscribe(result=>{
      if(result['success']){
        this.person[type] = event;
        this.notifier.notify("success", "Update successfull");
      }else{
        this.notifier.notify("error", "Update failed");
      }
    });
  }
}