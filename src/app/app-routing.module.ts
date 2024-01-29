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
import { FaqComponent } from './static-page/faq/faq.component';
import { PrivacyComponent } from './static-page/privacy/privacy.component';
import { TNCComponent } from './static-page/tnc/tnc.component';
import { ContactUsComponent } from './static-page/contact-us/contact-us.component';
import { CampaignComponent } from './static-page/campaign/campaign.component';
import { BeneficiaryComponent } from './static-page/campaign/beneficiary/beneficiary.component';
import { CreateCampaignComponent } from './static-page/campaign/create-campaign/create-campaign.component';
import { ViewCampaignComponent } from './static-page/campaign/view-campaign/view-campaign.component';
import { WallOfFameComponent } from './static-page/campaign/wall-of-fame/wall-of-fame.component';
import { DailyReportComponent } from './reports/daily-report/daily-report.component';
import { TransactionReportComponent } from './reports/transaction-report/transaction-report.component';
import { GlobalEarningReportComponent } from './reports/global-earning-report/global-earning-report.component';
import { ServiceOfferEditorComponent } from './employment/service-offer/service-offer-editor/service-offer-editor.component';
import { ServiceCategoryEditorComponent } from './employment/category/service-category-editor.component';
import { ServiceReqdEditorComponent } from './employment/service-reqd/service-reqd-editor/service-reqd-editor.component';
import { ProfileEditorComponent } from './marriage/profile-editor/profile-editor.component';
import { ProfileListComponent } from './marriage/profile-list/profile-list.component';
import { ProfileViewerComponent } from './marriage/profile-viewer/profile-viewer.component';
import { DummyPaymentComponent } from './payment/dummy-payment/dummy-payment.component';
import { PaymentConfirmationComponent } from './payment/payment-confirmation/payment-confirmation.component';
import { StoreComponent } from './static-page/store/store.component';

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
		component: CampaignComponent,
		data: { title: 'Explore', permissions: []}
	},
	{
		path: 'payment', 
		component: DummyPaymentComponent,
		data: { title: 'Payment', permissions: []}
	},
	{
		path: 'payment-confirmation', 
		component: PaymentConfirmationComponent,
		data: { title: 'Payment Confirmation', permissions: []}
	},
	{
		path: 'campaigns/edit', 
		component: CreateCampaignComponent,
		data: { title: 'Create Component', permissions: []}
	},
	{
		path: 'campaigns/edit/:id', 
		component: CreateCampaignComponent,
		canActivate: [AuthGuardService], 
		canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Create Component', permissions: [], isLoggedIn: true}
	},
	{
		path: 'campaigns/view/:id', 
		component: ViewCampaignComponent,
		data: { title: 'View Component', permissions: []}
	},

	{
		path: 'beneficiaries/:campaignid', 
		component: BeneficiaryComponent,
		data: { title: 'Beneficiaries', permissions: []}
	},
	{
		path: 'service-offer-editor', 
		component: ServiceOfferEditorComponent,
		canActivate: [AuthGuardService], 
		canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Service Offer Editor', permissions: [], isLoggedIn: true}
	},
	{
		path: 'service-category-editor', 
		component: ServiceCategoryEditorComponent,
		canActivate: [AuthGuardService], 
		canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Service Offer Editor', permissions: [], isLoggedIn: true}
	},
	{
		path: 'service-reqd-editor', 
		component: ServiceReqdEditorComponent,
		canActivate: [AuthGuardService], 
		canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Service Required Editor', permissions: [], isLoggedIn: true}
	},
	{
		path: 'marriage-profile-editor', 
		component: ProfileEditorComponent,
		canActivate: [AuthGuardService], 
		canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Marriage Profile Editor', permissions: [], isLoggedIn: true}
	},
	{
		path: 'marriage-profile-editor/:id', 
		component: ProfileEditorComponent,
		canActivate: [AuthGuardService], 
		canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Marriage Profile Editor', permissions: [], isLoggedIn: true}
	},
	{
		path: 'wall-of-fame', 
		component: WallOfFameComponent,
		data: { title: 'Wall of fame', permissions: []}
	},
	{
		path: 'marriage-profile-list', 
		component: ProfileListComponent,
		data: { title: 'Marriage Profiles', permissions: []}
	},
	{
		path: 'marriage-profile-list/:profileOwner', 
		component: ProfileListComponent,
		data: { title: 'Marriage Profiles', permissions: []}
	},
	{
		path: 'marriage-profile-viewer/:id', 
		component: ProfileViewerComponent,
		data: { title: 'Marriage Profile', permissions: []}
	},
	{
		path: 'faq', 
		component: FaqComponent,
		data: { title: 'FAQ', permissions: []}
	},
	{
		path: 'privacy', 
		component: PrivacyComponent,
		data: { title: 'Privacy', permissions: []}
	},
	{
		path: 'tnc', 
		component: TNCComponent,
		data: { title: 'Terms & Conditions', permissions: []}
	},
	{
		path: 'contact', 
		component: ContactUsComponent,
		data: { title: 'Contact-Us', permissions: []}
	},
	{
		path: 'refund-policy', 
		component: ContactUsComponent,
		data: { title: 'Refund Policy', permissions: []}
	},
	{
		path: 'shipping-policy', 
		component: ContactUsComponent,
		data: { title: 'Shipping Policy', permissions: []}
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
		path: 'daily-report', 
		component: DailyReportComponent,
		data: { title: 'My Profile', permissions: []}
	},
	{
		path: 'transaction-report', 
		component: TransactionReportComponent,
		data: { title: 'Transactions', permissions: []}
	},
	{
		path: 'global-earning-report', 
		component: GlobalEarningReportComponent,
		data: { title: 'Transactions', permissions: []}
	},
  {
		path: 'store', 
		component: StoreComponent,
		data: { title: 'Store', permissions: []}
	},
	{
		path: 'admin', 
		component: SidenavComponent,
		canActivate: [AuthGuardService], 
		canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Admin', permissions: ["ADMIN"]},
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
				data:{title: 'Person', resources: []}},
		]
	},
	/*{
		path: 'catalogue', 
		component: CatalogueComponent,
		canActivate: [AuthGuardService], 
		canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Admin', permissions: ["ADMIN"]},
	}*/
	{path: 'shoppin', loadChildren: () => import('./shoppin/shoppin.module').then(m => m.ShoppinModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
  	enableTracing: false,
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
