import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EventInvitationsComponent } from '../event-invitations/event-invitations.component';
import { HomeEvent } from '../model/home-event.model';

@Component({
  selector: 'app-organizer-event-card',
  templateUrl: './organizer-event-card.component.html',
  styleUrl: './organizer-event-card.component.scss',
})
export class OrganizerEventCardComponent {
  @Input()
  event!: HomeEvent;

  @Output()
  clicked: EventEmitter<HomeEvent> = new EventEmitter<HomeEvent>();

  changeFavouriteEvent(mouseEvent: MouseEvent): void {
    mouseEvent.stopPropagation();
    console.log(this.event);
    this.clicked.emit(this.event);
  }

  constructor(
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  formatDateTime(date: string): string {
    const dateObj = new Date(date);
    return this.datePipe.transform(dateObj, 'yyyy-MM-dd HH:mm') || '';
  }

  formatLocation(country: string, city: string) {
    return country + ',' + city;
  }

  openEmailDialog(eventId: number, mouseEvent: MouseEvent): void {
    mouseEvent.stopPropagation();
    this.dialog.open(EventInvitationsComponent, {
      width: '650px',
      data: { eventId },
    });
  }

  purchase(mouseEvent: MouseEvent) {
    mouseEvent.stopPropagation();
    this.router.navigate([`/event/my-events/${this.event.id}`], {
      state: { event: this.event.id },
    });
  }

  openBudgetPlan(mouseEvent: MouseEvent) {
    mouseEvent.stopPropagation();
    this.router.navigate([`/event/budget-plan`], {
      state: { eventId: this.event.id },
    });
  }

  goToEvent() {
    this.router.navigate(['/event', this.event.id]);
  }
}
