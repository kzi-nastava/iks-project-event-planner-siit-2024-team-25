import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListServicesComponent } from './list-services/list-services.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { ServiceFormComponent } from './service-form/service-form.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'servicePage', component: ListServicesComponent },
  {path : 'serviceDetails/:id', component:ServiceDetailsComponent},
  {path:'serviceEditForm/:id' , component:ServiceFormComponent},
  {path :'serviceCreateForm', component: ServiceFormComponent},
]

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class ServiceRoutingModule { }
