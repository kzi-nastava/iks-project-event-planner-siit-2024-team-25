import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleGuard } from '../../infrastructure/auth/guard/role.guard';
import { UserRole } from '../../infrastructure/auth/model/user-role.model';
import { ListServicesComponent } from './list-services/list-services.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { ServiceFormComponent } from './service-form/service-form.component';
import { BookServiceDialogComponent } from './book-service-dialog/book-service-dialog.component';

const routes: Routes = [
  { path: 'services', component: ListServicesComponent },
  { path: 'services/:id', component: ServiceDetailsComponent },
  {
    path: 'services/:id/purchase',
    component: BookServiceDialogComponent,
    data: { roles: [UserRole.Owner] },
  },
  {
    path: 'serviceForm/:id',
    component: ServiceFormComponent,
    canActivate: [roleGuard],
    data: { roles: [UserRole.Owner] },
  },
  {
    path: 'serviceForm',
    component: ServiceFormComponent,
    canActivate: [roleGuard],
    data: { roles: [UserRole.Owner] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceRoutingModule {}
