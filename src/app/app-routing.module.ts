import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ServiceComponent } from './infrastructure/Offering/service/service.component';
import { ServiceFormComponent } from './infrastructure/Offering/service/service-form/service-form.component';
import { ServiceDetailsComponent } from './infrastructure/Offering/service/service-details/service-details.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'servicePage', component: ServiceComponent },
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
