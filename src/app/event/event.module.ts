import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeTopEventsComponent } from './home-top-events/home-top-events.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { HomeAllEventsComponent } from './home-all-events/home-all-events.component';
import { HomeEventCardComponent } from './home-event-card/home-event-card.component';
import { OfferingModule } from "../offering/offering.module";


@NgModule({
  declarations: [
    HomeTopEventsComponent,
    HomeAllEventsComponent,
    HomeEventCardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    OfferingModule
],
  exports: [
    HomeTopEventsComponent,
    HomeAllEventsComponent
  ]
})
export class EventModule { }
