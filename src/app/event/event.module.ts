import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeTopEventsComponent } from './home-top-events/home-top-events.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { HomeAllEventsComponent } from './home-all-events/home-all-events.component';
import { HomeEventCardComponent } from './home-event-card/home-event-card.component';
import { OfferingModule } from '../offering/offering.module';
import { HomeEventFilterComponent } from './home-event-filter/home-event-filter.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeTopEventsComponent,
    HomeAllEventsComponent,
    HomeEventCardComponent,
    HomeEventFilterComponent,
  ],
  imports: [CommonModule, MaterialModule, OfferingModule, FormsModule],
  exports: [HomeTopEventsComponent, HomeAllEventsComponent],
})
export class EventModule {}
