import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { EventInvitationsComponent } from '../event-invitations/event-invitations.component';
import { Event } from '../model/event.model';
import { EventService } from '../service/event.service';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss',
})
export class EventPageComponent implements OnInit, OnDestroy {
  eventId!: number;
  invitationCode!: string;
  event!: Event;
  isOrganizer$ = new BehaviorSubject<boolean>(false);
  isMobile$ = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.isMobile$.next(result.matches);
      });

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.eventId = +params['id'];

      this.route.queryParams
        .pipe(takeUntil(this.destroy$))
        .subscribe((queryParams) => {
          this.invitationCode = queryParams['invitationCode'];
          this.loadEvent();
        });
    });

    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (this.event) {
        this.isOrganizer$.next(user?.userId === this.event.organizer.id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadEvent(): void {
    this.eventService
      .getEvent(this.eventId, this.invitationCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (event: Event) => {
          this.event = event;
          const currentUser = this.authService.getUser();
          this.isOrganizer$.next(currentUser?.userId === event.organizer.id);
        },
        error: () => {
          this.router.navigateByUrl('/');
        },
      });
  }

  addToFavorites(): void {
    // this.eventService.addToFavorites(this.eventId)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe();
  }

  openEmailDialog(): void {
    this.dialog.open(EventInvitationsComponent, {
      width: '650px',
      data: { eventId: this.eventId },
    });
  }

  openBudgetPlan() {
    this.router.navigate([`/event/budget-plan`], {
      state: { eventId: this.event.id },
    });
  }
}
