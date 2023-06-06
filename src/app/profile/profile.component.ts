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


  constructor(
    private profileService: ProfileService,
    private notifier: NotifierService
  ){

  }

  ngOnInit(){
    this.profileService.getPersonDetail().subscribe(result=>{
      this.person = Person.fromJSON(result);
      console.log(this.person);
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
    }else if(this.selectedPersonForApproval !== "APPROVAL_PENDING"){
      this.notifier.notify("error", `${this.selectedPersonForApproval.n} is already joined`);
    }else{
      this.profileService.approveNewJoinee(
        this.selectedPersonForApproval.id, joiningCharges
      ).subscribe(result=>{
        console.log(result);
      });
    }
  }
}