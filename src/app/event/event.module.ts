import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeTopEventsComponent } from './home-top-events/home-top-events.component';
import { MaterialModule } from '../infrastructure/material/material.module';



@NgModule({
  declarations: [
    HomeTopEventsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    HomeTopEventsComponent
  ]
})
export class EventModule { }
