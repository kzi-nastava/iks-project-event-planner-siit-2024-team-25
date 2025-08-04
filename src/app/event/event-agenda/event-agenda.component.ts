import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { Activity } from '../model/activity.model';
import { EventService } from '../service/event.service';

@Component({
  selector: 'app-event-agenda',
  templateUrl: './event-agenda.component.html',
  styleUrl: './event-agenda.component.scss',
})
export class EventAgendaComponent implements OnInit, OnDestroy {
  @Input() eventId$!: Observable<number | null>;
  activities: Activity[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private eventService: EventService,
    private toastService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.eventId$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((eventId) => {
          if (eventId) {
            return this.eventService.getAgenda(eventId);
          } else {
            return of([]);
          }
        }),
      )
      .subscribe({
        next: (activities: Activity[]) => {
          this.activities = activities;
        },
        error: (err: ErrorResponse) => {
          this.toastService.error(err.message, 'Failed to load event agenda');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
