import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { environment } from '../../../environment/environment';
import { UserRole } from '../../infrastructure/auth/model/user-role.model';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { EventInvitationsComponent } from '../event-invitations/event-invitations.component';
import { Event } from '../model/event.model';
import { EventService } from '../service/event.service';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss',
})
export class EventPageComponent implements OnInit, OnDestroy {
  eventId$ = new BehaviorSubject<number | null>(null);
  invitationCode!: string;
  event!: Event;
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isOrganizer$ = new BehaviorSubject<boolean>(false);
  isAdmin$ = new BehaviorSubject<boolean>(false);
  isAttending$!: Observable<boolean>;
  isMobile$ = new BehaviorSubject<boolean>(false);
  private refreshTrigger$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.isMobile$.next(result.matches);
      });

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.eventId$.next(+params['id']);

      this.route.queryParams
        .pipe(takeUntil(this.destroy$))
        .subscribe((queryParams) => {
          this.invitationCode = queryParams['invitationCode'];
          this.loadEvent();
        });
    });

    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.isLoggedIn$.next(!!user);
      if (this.event) {
        this.isOrganizer$.next(user?.userId === this.event.organizer.id);
      }
      this.isAdmin$.next(user?.role === UserRole.Admin);
    });

    this.isAttending$ = combineLatest([
      this.eventId$,
      this.authService.user$,
      this.refreshTrigger$.pipe(startWith(null)),
    ]).pipe(
      switchMap(([eventId, user]) => {
        if (eventId && user) {
          return this.eventService.isAttending(eventId, user.userId);
        }
        return of(false);
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadEvent(): void {
    this.eventService
      .getEvent(this.eventId$.getValue()!, this.invitationCode)
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

  get reportDownloadUrl(): string | null {
    if (!this.eventId$) return null;
    return environment.apiHost + `/api/events/${this.eventId$}/report`;
  }

  toggleFavorite(): void {
    if (this.event.isFavorite) {
      this.eventService
        .removeFromFavorites(this.event.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.event.isFavorite = false;
          },
          error: (err: ErrorResponse) => {
            this.toastService.error(
              err.message,
              'Failed to remove event from favorites'
            );
          },
        });
    } else {
      this.eventService
        .addToFavorites(this.event.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.event.isFavorite = true;
          },
          error: (err: ErrorResponse) => {
            this.toastService.error(
              err.message,
              'Failed to add event to favorites'
            );
          },
        });
    }
  }

  openEmailDialog(): void {
    this.dialog.open(EventInvitationsComponent, {
      width: '650px',
      data: { eventId: this.eventId$ },
    });
  }

  openBudgetPlan() {
    this.router.navigate([`/event/budget-plan`], {
      state: { eventId: this.event.id },
    });
  }

  openPurchase() {
    this.router.navigate([`/event/my-events/${this.event.id}`], {
      state: { event: this.event.id },
    });
  }

  joinEvent() {
    this.eventService.joinEvent(this.event.id).subscribe({
      next: () => {
        this.refreshTrigger$.next();
        this.toastService.success('You have successfully joined the event!');
      },
      error: (err: ErrorResponse) => {
        this.toastService.error(err.message, 'Failed to join the event!');
      },
    });
  }
}
