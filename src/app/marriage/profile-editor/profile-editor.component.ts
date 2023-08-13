import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import {AuthenticationService} from './../../../authentication/authentication.service';
import { EmploymentService } from './../../employment.service';
import { NotifierService } from 'angular-notifier';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {AddressService} from './../../../shared/address/address.service';
import { GeneralService } from '../../../general.service';
import {ServiceRequirement} from './../../employment';
import { Observable } from 'rxjs/Observable';
import { map, startWith, switchMap, filter } from 'rxjs/operators';


@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss'],
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

  constructor(
    
  ){}

  ngOnInit(){

  }
}