import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbNavModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import {NgApexchartsModule} from 'ng-apexcharts';
import {FullCalendarModule} from '@fullcalendar/angular';
import {SimplebarAngularModule} from 'simplebar-angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import bootstrapPlugin from '@fullcalendar/bootstrap';
import {LightboxModule} from 'ngx-lightbox';

import {WidgetModule} from '../shared/widget/widget.module';
import {UIModule} from '../shared/ui/ui.module';

import {PagesRoutingModule} from './pages-routing.module';

import {DashboardsModule} from './dashboards/dashboards.module';
import {HttpClientModule} from '@angular/common/http';
import {ProfileComponent} from './profile/profile.component';
import {TranslateModule} from '@ngx-translate/core';
import {RoleComponent} from './administrator-management/role/role.component';
import {CategoryComponent} from './master/category/category.component';
import {SubCategoryComponent} from './master/sub-category/sub-category.component';
import {SubCategoryProductComponent} from './master/sub-category-product/sub-category-product.component';
import {AdministratorComponent} from './administrator-management/administrator/administrator.component';
import {NgSelectModule} from '@ng-select/ng-select';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  bootstrapPlugin
]);

@NgModule({
  declarations: [
    AdministratorComponent,
    ProfileComponent,
    RoleComponent,
    CategoryComponent,
    SubCategoryComponent,
    SubCategoryProductComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbModalModule,
    PagesRoutingModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    DashboardsModule,
    HttpClientModule,
    UIModule,
    WidgetModule,
    FullCalendarModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbCollapseModule,
    SimplebarAngularModule,
    LightboxModule,
    TranslateModule,
    NgSelectModule
  ]
})
export class PagesModule {
}
