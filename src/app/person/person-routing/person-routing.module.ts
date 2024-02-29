import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router'
import {AuthGuardService} from './../../authentication/auth-guard.service'
import { CanDeactivateGuardService } from './../../authentication/can-deactivate-guard.service'
import { PersonComponent } from './../person.component'

const personRoutes: Routes = [
	{
    path: 'person', 
    component: PersonComponent,
    canActivate: [AuthGuardService], 
    canDeactivate:[CanDeactivateGuardService],
    data: { title: 'Dashboard', permissions: ['CREATE_PERMISSION']},
    children: []
  }
]

@NgModule({
  imports:[
  	RouterModule.forChild(personRoutes)
  ],
  exports:[
  	RouterModule
  ]
})
export class PersonRoutingModule { }
