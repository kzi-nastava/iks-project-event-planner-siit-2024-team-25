import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListServicesComponent } from './list-services/list-services.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { ServiceFormComponent } from './service-form/service-form.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'services', component: ListServicesComponent },
  {path : 'services/:id', component:ServiceDetailsComponent},
  {path:'serviceForm/:id' , component:ServiceFormComponent},
  {path :'serviceForm', component: ServiceFormComponent},
]

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class ServiceRoutingModule { }
