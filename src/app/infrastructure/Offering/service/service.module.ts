import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { ListServicesComponent } from './list-services/list-services.component';
import { ServiceFormComponent } from './service-form/service-form.component';
import { ServiceComponent } from './service.component';



@NgModule({
  declarations: [
    ListServicesComponent,
    ServiceFormComponent,
    ServiceComponent
  ],
  imports: [
    MaterialModule,
    CommonModule
  ]
})
export class ServiceModule { }
