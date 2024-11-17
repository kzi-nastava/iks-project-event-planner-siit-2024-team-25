import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { ListServicesComponent } from './list-services/list-services.component';



@NgModule({
  declarations: [
    ListServicesComponent
  ],
  imports: [
    MaterialModule,
    CommonModule
  ]
})
export class ServiceModule { }
