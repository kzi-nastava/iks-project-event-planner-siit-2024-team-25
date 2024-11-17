import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { ListServicesComponent } from './list-services/list-services.component';
import { ServiceFormComponent } from './service-form/service-form.component';
import { ServiceComponent } from './service.component';
import { ServiceDialogComponent } from './service-dialog/service-dialog.component';
import { ServiceDialogInformationComponent } from './service-dialog/service-dialog-information.component';



@NgModule({
  declarations: [
    ListServicesComponent,
    ServiceFormComponent,
    ServiceComponent,
    ServiceDialogComponent,
    ServiceDialogInformationComponent
  ],
  imports: [
    MaterialModule,
    CommonModule
  ]
})
export class ServiceModule { }
