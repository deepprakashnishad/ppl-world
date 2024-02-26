import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './../authentication/auth-guard.service';
import { CanDeactivateGuardService } from './../authentication/can-deactivate-guard.service';
import { CockpitComponent } from './cockpit/cockpit.component';
import { TraderComponent } from './trader.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ListOrderComponent } from './order/list-order/list-order.component';
import { httpInterceptorProviders } from '../http-interceptors/index';

const routes: Routes = [
	
	{
		path: '', 
		component: TraderComponent,
		canActivate: [AuthGuardService], 
  	canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Trader', isLoggedIn: true, permissions: []},
		children: [
			{
				path: '',
				component: PortfolioComponent,
				canActivate: [AuthGuardService], 
		  	canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Portfolio', isLoggedIn: true, permissions: []}
			},
			{
				path: 'cockpit', 
				component: CockpitComponent,
				canActivate: [AuthGuardService], 
		  	canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Trader Cockpit', isLoggedIn: true, permissions: []}
			},
			{
				path: 'my-orders',
				component: ListOrderComponent,
				canActivate: [AuthGuardService], 
		  	canDeactivate:[CanDeactivateGuardService],
				data: { title: 'Portfolio', isLoggedIn: true, permissions: []}
			}
		]
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    httpInterceptorProviders
  ],
})
export class TraderRoutingModule { }
