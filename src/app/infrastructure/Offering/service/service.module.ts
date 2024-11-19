import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { ListServicesComponent } from './list-services/list-services.component';
import { ServiceFormComponent } from './service-form/service-form.component';
import { ServiceComponent } from './service.component';
import { ServiceDialogComponent } from './service-dialog/service-dialog.component';
import { ServiceDialogInformationComponent } from './service-dialog/service-dialog-information.component';
import { ServiceCardComponent } from './service-card/service-card.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ListServicesComponent,
    ServiceFormComponent,
    ServiceComponent,
    ServiceDialogComponent,
    ServiceDialogInformationComponent,
    ServiceCardComponent,
    ServiceDetailsComponent
  ],
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule
  ]
})
export class ServiceModule { }
