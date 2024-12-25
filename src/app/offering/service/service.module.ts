import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../infrastructure/material/material.module';
import { ListServicesComponent } from './list-services/list-services.component';
import { ServiceCardComponent } from './service-card/service-card.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { ServiceDialogInformationComponent } from './service-dialog/service-dialog-information.component';
import { ServiceDialogComponent } from './service-dialog/service-dialog.component';
import { ServiceFormComponent } from './service-form/service-form.component';
import { ServiceRoutingModule } from './service-routing.module';
import { BookServiceDialogComponent } from './book-service-dialog/book-service-dialog.component';

@NgModule({
  declarations: [
    ListServicesComponent,
    ServiceFormComponent,
    ServiceDialogComponent,
    ServiceDialogInformationComponent,
    ServiceCardComponent,
    ServiceDetailsComponent,
    BookServiceDialogComponent,
  ],

  imports: [
    MaterialModule,
    CommonModule,
    ServiceRoutingModule,
    ReactiveFormsModule,
  ],
})
export class ServiceModule {}
