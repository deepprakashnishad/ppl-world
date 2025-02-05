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
import { SaleReportComponent } from './reports/sale-report/sale-report.component';
import { GlobalEarningReportComponent } from './reports/global-earning-report/global-earning-report.component';
import { ServiceOfferEditorComponent } from './employment/service-offer/service-offer-editor/service-offer-editor.component';
// import { ServiceCategoryEditorComponent } from './employment/category/service-category-editor.component';
import { ServiceReqdEditorComponent } from './employment/service-reqd/service-reqd-editor/service-reqd-editor.component';
import { ProfileEditorComponent } from './marriage/profile-editor/profile-editor.component';
import { ProfileListComponent } from './marriage/profile-list/profile-list.component';
import { ProfileViewerComponent } from './marriage/profile-viewer/profile-viewer.component';
import { DummyPaymentComponent } from './payment/dummy-payment/dummy-payment.component';
import { PaymentConfirmationComponent } from './payment/payment-confirmation/payment-confirmation.component';
import { StoreComponent } from './static-page/store/store.component';
import { AddEditStoreComponent } from './admin/store/add-edit-store/add-edit-store.component';
import { SaleEntryListComponent } from './admin/sale-entry/sale-entry-list.component';

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
	/*{
		path: 'service-category-editor', 
		component: ServiceCategoryEditorComponent,
		canActivate: [AuthGuardService], 
		canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Service Offer Editor', permissions: [], isLoggedIn: true}
	},*/
	{
		path: 'service-reqd-editor', 
		component: ServiceReqdEditorComponent,
		canActivate: [AuthGuardService], 
		canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Service Required Editor', permissions: [], isLoggedIn: true}
	},
	{
    path: 'local-store', 
		component: AddEditStoreComponent,
		canActivate: [AuthGuardService], 
		canDeactivate:[CanDeactivateGuardService],
		data: { title: 'My Store', isLoggedIn: true, permissions: [], loginErrorMessage: "Please login to register as seller"}
  },
  {
		path: 'add-sale', 
		component: SaleEntryListComponent,
		canActivate: [AuthGuardService], 
		canDeactivate:[CanDeactivateGuardService],
		data: { title: 'Add New Sale', permissions: ['ADD_SALE']}
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
		path: 'wall-of-fame/:campaignId', 
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
		path: 'sale-report/:type', 
		component: SaleReportComponent,
		data: { title: 'Sale Report', permissions: []}
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
	// {path: 'person', loadChildren: () => import('./person/person.module').then(m => m.PersonModule)},
	{path: 'shoppin', loadChildren: () => import('./shoppin/shoppin.module').then(m => m.ShoppinModule)},
	{path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
	{path: 'trader', loadChildren: () => import('./trader/trader.module').then(m => m.TraderModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
  	enableTracing: false,
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
