import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './../authentication/auth-guard.service';
import { CanDeactivateGuardService } from './../authentication/can-deactivate-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PermissionComponent } from './permission/permission.component';
import { RoleComponent } from './role/role.component';
import { HomeComponent } from './home/home.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { SaleEntryListComponent } from './sale-entry/sale-entry-list.component';
import { StoreComponent } from './store/store.component';
import { ServiceCategoryEditorComponent } from '../employment/category/service-category-editor.component';

const routes: Routes = [
	
	{
		path: '', 
		component: HomeComponent,
		canActivate: [AuthGuardService], 
  	canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Dashboard', permissions: ['CREATE_PERMISSION']},
		children: [
			{
				path: '', 
				component: DashboardComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Dashboard', permissions: ['CREATE_PERMISSION']}
			},
			{
				path: 'add-sale', 
				component: SaleEntryListComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Activity Log', permissions: ['ADD_SALE']}
      },
      {
				path: 'store', 
				component: StoreComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Activity Log', permissions: ['APPROVE_STORE']}
      },
      {
				path: 'category', 
				component: ServiceCategoryEditorComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Activity Log', permissions: ['UPDATE_CATEGORY']}
      },
			{
				path: 'permission', 
				component: PermissionComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Permission', permissions: ['CREATE_PERMISSION']}
			},
			{
				path: 'role', 
				component: RoleComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Role', permissions: ['CREATE_ROLE']}
			},	
			{
				path: 'activity-log', 
				component: ActivityLogComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Activity Log', permissions: ['CREATE_ROLE']}
      },
			/*{path: 'person', loadChildren: './../person/person.module#PersonModule', canLoad: [AuthGuardService],
				data:{title: 'Person', resources: ['CREATE_PERSON', 'UPDATE_PERSON', 'DELETE_PERSON']}},*/
		]
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
