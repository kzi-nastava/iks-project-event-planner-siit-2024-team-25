import { DatePipe, Time } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HomeEvent } from '../model/home-event.model';
import { MatDialog } from '@angular/material/dialog';
import { EventInvitationsComponent } from '../event-invitations/event-invitations.component';

@Component({
  selector: 'app-home-event-card',
  templateUrl: './home-event-card.component.html',
  styleUrl: './home-event-card.component.scss',
})
export class HomeEventCardComponent {
  @Input()
  event!: HomeEvent;

  @Output()
  clicked: EventEmitter<HomeEvent> = new EventEmitter<HomeEvent>();

  changeFavouriteEvent(): void {
    this.clicked.emit(this.event);
  }

  constructor(private datePipe: DatePipe, private dialog: MatDialog) {}

  formatDateTime(date: string): string {
    const dateObj = new Date(date);
    return this.datePipe.transform(dateObj, 'yyyy-MM-dd HH:mm') || '';
  }

  formatLocation(country: string, city: string) {
    return country + ',' + city;
  }

  openEmailDialog(eventId: number): void {
    this.dialog.open(EventInvitationsComponent, {
      width: '650px',
      data: { eventId }
    });
  }
}
