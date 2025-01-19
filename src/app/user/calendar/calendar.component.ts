import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { CalendarEventType } from '../../event/model/calendar-event.model';
import { HomeEvent } from '../../event/model/home-event.model';
import { ServicePurchaseCard } from '../../event/model/service-purchase-card.model';
import { EventService } from '../../event/service/event.service';
import { PurchaseService } from '../../event/service/purchase.service';
import { UserRole } from '../../infrastructure/auth/model/user-role.model';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { User } from '../model/user.model';

const EVENT_COLOR = '#303c6c';
const MY_EVENT_COLOR = '#377a75';
const SERVICE_COLOR = '#7a3879';

type ViewType = 'attending' | 'organized' | 'reservations';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  @Input() user!: User;

  currentView: ViewType = 'attending';

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    firstDay: 1,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: false,
    displayEventTime: false,
    events: [],
    height: 'auto',
    dateClick: this.handleDateClick.bind(this),
    datesSet: this.handleDatesSet.bind(this),
    eventDisplay: 'block',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: '',
    },
  };

  selectedDate: Date | null = null;

  attendingEvents: HomeEvent[] = [];
  organizedEvents: HomeEvent[] = [];
  servicePurchases: ServicePurchaseCard[] = [];

  loading = false;

  constructor(
    private eventService: EventService,
    private purchaseService: PurchaseService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  handleDatesSet(dateInfo: any) {
    const startDate: Date = dateInfo.start;
    const endDate: Date = dateInfo.end;
    endDate.setDate(endDate.getDate() + 1);

    this.eventService
      .getCalendarEvents(startDate, endDate)
      .pipe(
        map((events) =>
          events.map((e) => ({
            title: e.title,
            start: new Date(e.startDate),
            end: new Date(e.endDate),
            color: this.getColor(e.eventType),
          })),
        ),
      )
      .subscribe({
        next: (events) => {
          this.calendarOptions = {
            ...this.calendarOptions,
            events: events,
          };
        },
        error: (err: ErrorResponse) => {
          this.toastr.error(err.message, 'Failed to load events!');
        },
      });
  }

  handleDateClick(arg: any) {
    this.selectedDate = arg.date;
    if (!this.selectedDate) return;

    this.loading = true;

    this.eventService
      .getAttendingEvents(this.selectedDate, this.selectedDate)
      .subscribe({
        next: (events: HomeEvent[]) => {
          this.attendingEvents = events;
          this.loading = false;
        },
        error: (err: ErrorResponse) => {
          this.toastr.error(err.message, 'Failed to load events');
        },
      });

    if (this.isEventOrganizer) {
      this.eventService
        .getOrganizerEvents(this.selectedDate, this.selectedDate)
        .subscribe({
          next: (events: HomeEvent[]) => {
            this.organizedEvents = events;
          },
          error: (err: ErrorResponse) => {
            this.toastr.error(err.message, 'Failed to load events');
          },
        });
    } else if (this.isOwner) {
      this.purchaseService
        .getOwnerPurchases(this.selectedDate, this.selectedDate)
        .subscribe({
          next: (purchases: ServicePurchaseCard[]) => {
            this.servicePurchases = purchases;
          },
          error: (err: any) => {
            console.error(err);
          },
        });
    }
  }

  onViewChange() {
    if (this.selectedDate) {
      this.handleDateClick({ date: this.selectedDate });
    }
  }

  getCurrentItems(): any[] {
    switch (this.currentView) {
      case 'attending':
        return this.attendingEvents;
      case 'organized':
        return this.organizedEvents;
      case 'reservations':
        return this.servicePurchases;
      default:
        return [];
    }
  }

  getEmptyStateMessage(): string {
    switch (this.currentView) {
      case 'attending':
        return 'Events';
      case 'organized':
        return 'Organized Events';
      case 'reservations':
        return 'Reservations';
      default:
        return 'Items';
    }
  }

  navigateToEvent(eventId: number) {
    this.router.navigate(['/event', eventId]);
  }

  navigateToReservation(reservationId: number) {
    // TODO: navigate
  }

  get isEventOrganizer(): boolean {
    return this.user.userRole === UserRole.EventOrganizer;
  }

  get isOwner(): boolean {
    return this.user.userRole === UserRole.Owner;
  }

  private getColor(eventType: CalendarEventType): string {
    switch (eventType) {
      case 'EVENT':
        return EVENT_COLOR;
      case 'MY_EVENT':
        return MY_EVENT_COLOR;
      case 'RESERVATION':
        return SERVICE_COLOR;
    }
  }
}
