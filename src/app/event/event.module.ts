import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../infrastructure/material/material.module';
import { OfferingModule } from '../offering/offering.module';
import { EventRoutingModule } from './event-routing.module';
import { EventTypeListComponent } from './event-type-list/event-type-list.component';
import { EventTypeComponent } from './event-type/event-type.component';
import { HomeAllEventsComponent } from './home-all-events/home-all-events.component';
import { HomeEventCardComponent } from './home-event-card/home-event-card.component';
import { HomeEventFilterComponent } from './home-event-filter/home-event-filter.component';
import { HomeTopEventsComponent } from './home-top-events/home-top-events.component';
import { EventInvitationsComponent } from './event-invitations/event-invitations.component';
import { EventPageComponent } from './event-page/event-page.component';
import { OrganizerEventComponent } from './organizer-event/organizer-event.component';
import { OrganizerEventCardComponent } from './organizer-event-card/organizer-event-card.component';
import { OrganizerEventPurchaseComponent } from './organizer-event-purchase/organizer-event-purchase.component';

@NgModule({
  declarations: [
    HomeTopEventsComponent,
    HomeAllEventsComponent,
    HomeEventCardComponent,
    HomeEventFilterComponent,
    EventTypeComponent,
    EventTypeListComponent,
    EventInvitationsComponent,
    EventPageComponent,
    OrganizerEventComponent,
    OrganizerEventCardComponent,
    OrganizerEventPurchaseComponent,
  ],
  imports: [
    CommonModule,
    EventRoutingModule,
    MaterialModule,
    OfferingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [HomeTopEventsComponent, HomeAllEventsComponent],
  providers: [DatePipe],
})
export class EventModule {}
