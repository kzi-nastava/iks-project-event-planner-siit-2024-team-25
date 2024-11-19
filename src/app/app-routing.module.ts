import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ServiceFormComponent } from './offering/service/service-form/service-form.component';
import { ServiceDetailsComponent } from './offering/service/service-details/service-details.component';
import { HomeComponent } from './home/home.component';
import { ListServicesComponent } from './offering/service/list-services/list-services.component';

const routes: Routes = [
  { path: 'servicePage', component: ListServicesComponent },
  {path : 'service/:id', component:ServiceDetailsComponent},
  {path:'serviceEditForm/:id' , component:ServiceFormComponent},
  {path :'serviceCreateForm', component: ServiceFormComponent},
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
