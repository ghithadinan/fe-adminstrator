import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DefaultComponent} from './dashboards/default/default.component';
import {ProfileComponent} from './profile/profile.component';
import {RoleComponent} from './administrator-management/role/role.component';
import {CategoryComponent} from './master/category/category.component';
import {SubCategoryComponent} from './master/sub-category/sub-category.component';
import {SubCategoryProductComponent} from './master/sub-category-product/sub-category-product.component';
import {AdministratorComponent} from './administrator-management/administrator/administrator.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard'},
  {path: 'dashboard', component: DefaultComponent},
  {path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)},
  {path: 'profile', component: ProfileComponent},
  {path: 'administrator-management/administrator', component: AdministratorComponent},
  {path: 'administrator-management/role', component: RoleComponent},
  {path: 'master/category', component: CategoryComponent},
  {path: 'master/sub-category', component: SubCategoryComponent},
  {path: 'master/sub-category-product', component: SubCategoryProductComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {
}
