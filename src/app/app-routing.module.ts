import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from './authentication/auth-guard.service';
import {CanDeactivateGuardService} from './authentication/can-deactivate-guard.service';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { PermissionComponent } from './admin/permission/permission.component';
import { RoleComponent } from './admin/role/role.component';
import { SidenavComponent } from './admin/sidenav/sidenav.component';
import { ActivityLogComponent } from './admin/activity-log/activity-log.component';
import { PersonComponent } from './person/person.component';
import { UserReportComponent } from './admin/reports/user-report/user-report.component';
import {AboutUsComponent} from './static-page/about-us/about-us.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
	 {
		path: '', 
		component: HomeComponent,
		data: { title: 'Home', permissions: []}
	},	 
	{
		path: 'home', 
		component: HomeComponent,
		data: { title: 'Home', permissions: []}
	},
	{
		path: 'about-us', 
		component: AboutUsComponent,
		data: { title: 'About-Us', permissions: []}
	},
	{
		path: 'explore', 
		component: HomeComponent,
		data: { title: 'Explore', permissions: []}
	},
	{
		path: 'faq', 
		component: HomeComponent,
		data: { title: 'FAQ', permissions: []}
	},
	{
		path: 'contact', 
		component: HomeComponent,
		data: { title: 'Contact-Us', permissions: []}
	},
	{
		path: 'downloads', 
		component: HomeComponent,
		data: { title: 'Downloads', permissions: []}
	},
	{
		path: 'profile', 
		component: ProfileComponent,
		data: { title: 'My Profile', permissions: []}
	},
	{
		path: 'admin', 
		component: SidenavComponent,
		canActivate: [AuthGuardService], 
		canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Admin', permissions: ['SHOP_EDITOR']},
		children: [
			{
				path: '', 
				component: DashboardComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Brands', permissions: ['SHOP_EDITOR','CREATE_BRAND', 'UPDATE_BRAND', 'DELETE_BRAND']},
			},
			{
				path: 'user-report',
				component: UserReportComponent,
				canActivate: [AuthGuardService],
				canDeactivate: [CanDeactivateGuardService],
				data: { title: 'Attributes', permissions: ['SHOP_EDITOR'] }
			},
			{
				path: 'person',
				component: PersonComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'product', permissions: ['CREATE_PERSON', 'UPDATE_PERSON', 'DELETE_PERSON']},				
			},
			{
				path: 'permission', 
				component: PermissionComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Permission', permissions: []}
			},	
		
			{
				path: 'role', 
				component: RoleComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Role', permissions: []}
			},
			{
				path: 'activity-log', 
				component: ActivityLogComponent,
				canActivate: [AuthGuardService], 
				canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Activity Log', permissions: ['SHOP_EDITOR']}
			},	
			{path: 'person', loadChildren: './../person/person.module#PersonModule', canLoad: [AuthGuardService],
				data:{title: 'Person', resources: ['CREATE_PERSON', 'UPDATE_PERSON', 'DELETE_PERSON']}},
		]
	},
	
	/* {path: 'person', loadChildren: './person/person.module#PersonModule', canLoad: [AuthGuardService],
		data:{title: 'Person', resources: ['CREATE_PERSON', 'UPDATE_PERSON', 'DELETE_PERSON']}}, */

	/* {path: 'admin', loadChildren: './admin/admin.module#AdminModule', canLoad: [AuthGuardService],
		data:{title: 'Admin', resources: []}}, */
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
  	enableTracing: false,
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
