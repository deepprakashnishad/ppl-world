import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoleComponent } from './role/role.component';
import { PermissionComponent } from './permission/permission.component';
import { HomeComponent } from './home/home.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { UserReportComponent } from './reports/user-report/user-report.component';
import { SaleEntryListComponent } from './sale-entry/sale-entry-list.component';
import { AddEditSaleEntryComponent } from './sale-entry/add-edit-sale-entry/add-edit-sale-entry.component';
import { PersonExactMatchComponent } from 'src/app/person/person-exact-match-extra/person-exact-match.component';

@NgModule({
  declarations: [
    SidenavComponent,
    DashboardComponent,
    RoleComponent,
    PermissionComponent,
    HomeComponent,
    ActivityLogComponent,
    UserReportComponent,
    SaleEntryListComponent,
    AddEditSaleEntryComponent,
    PersonExactMatchComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ],
  exports: [
  ],
  entryComponents:[
     AddEditSaleEntryComponent
  ],
  providers:[]
})
export class AdminModule { }
