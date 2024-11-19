import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListServicesComponent } from './infrastructure/Offering/service/list-services/list-services.component';
import { ServiceComponent } from './infrastructure/Offering/service/service.component';
import { ServiceFormComponent } from './infrastructure/Offering/service/service-form/service-form.component';
import { ServiceDetailsComponent } from './infrastructure/Offering/service/service-details/service-details.component';

const routes: Routes = [
  { path: 'servicePage', component: ServiceComponent },
  {path : 'service/:id', component:ServiceDetailsComponent},
  {path:'serviceEditForm/:id' , component:ServiceFormComponent},
  {path :'serviceCreateForm', component: ServiceFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
