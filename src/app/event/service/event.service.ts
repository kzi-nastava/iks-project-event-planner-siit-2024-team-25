import { DatePipe } from '@angular/common';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

import { environment } from '../../../environment/environment';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { Page } from '../../shared/model/page.mode';
import { Activity } from '../model/activity.model';
import { Attendee } from '../model/attendee.model';
import { CalendarEvent } from '../model/calendar-event.model';
import { EventInvitation } from '../model/event.invitation.model';
import { Event } from '../model/event.model';
import { EventRequest } from '../model/event.request.model';
import { HomeEvent } from '../model/home-event.model';
import { HomeEventFilterParams } from '../model/home.event.filter.param.model';
import { ReviewStats } from '../model/review-stats.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {}

  getEvent(eventId: number, invitationCode?: string): Observable<Event> {
    let params = new HttpParams();
    if (!!invitationCode) {
      params.append('invitationCode', invitationCode);
    }
    return this.httpClient
      .get<Event>(environment.apiHost + `/api/events/${eventId}`, { params })
      .pipe(catchError(this.handleError));
  }

  getHomeEvent(id: number, invitationCode: string = '') {
    let params = new HttpParams();

    if (invitationCode !== '') {
      params = params.set('invitationCode', invitationCode);
    }
    return this.httpClient
      .get<Page<HomeEvent>>(`${environment.apiHost}/api/events/` + id, {
        params,
      })
      .pipe(map((page) => page.content));
  }

  getMyEvents(
    page: number,
    filterParams?: HomeEventFilterParams
  ): Observable<{ currentEvents: HomeEvent[]; totalPages: number }> {
    let params = this.getHttpParams(filterParams);
    params = params.set('page', page);

    return this.httpClient
      .get<Page<HomeEvent>>(`${environment.apiHost}/api/events/`, { params })
      .pipe(
        map((page) => ({
          currentEvents: page.content,
          totalPages: page.totalPages,
        }))
      );
  }

  getTopEvents(): Observable<HomeEvent[]> {
    const user = this.authService.getUser();

    return this.httpClient
      .get<Page<HomeEvent>>(`${environment.apiHost}/api/events/top`)
      .pipe(map((page) => page.content));
  }

  private getHttpParams(filterParams?: HomeEventFilterParams): HttpParams {
    let params = new HttpParams();

    if (filterParams) {
      Object.keys(filterParams).forEach((key) => {
        if (filterParams[key] !== undefined && filterParams[key] !== null) {
          params = params.set(key, filterParams[key]);
        }
      });

      if (filterParams.startDate) {
        params = params.set(
          'startDate',
          this.datePipe.transform(filterParams.startDate, 'yyyy-MM-dd')!
        );
      }

      if (filterParams.endDate) {
        params = params.set(
          'endDate',
          this.datePipe.transform(filterParams.endDate, 'yyyy-MM-dd')!
        );
      }
    }

    return params;
  }

  getEvents(
    page: number,
    filterParams?: HomeEventFilterParams
  ): Observable<{ currentEvents: HomeEvent[]; totalPages: number }> {
    let params = this.getHttpParams(filterParams);

    console.log(filterParams?.startTime);
    console.log(filterParams?.endTime);

    params = params.set('page', page);

    console.log(params);

    return this.httpClient
      .get<Page<HomeEvent>>(`${environment.apiHost}/api/events/all`, { params })
      .pipe(
        map((page) => ({
          currentEvents: page.content,
          totalPages: page.totalPages,
        }))
      );
  }

  sendInvitations(invitations: EventInvitation[], eventId: number): void {
    this.httpClient
      .post(
        `${environment.apiHost}/api/events/${eventId}/send-invitations`,
        invitations
      )
      .subscribe({
        next: () => console.log('Invitations sent successfully.'),
        error: (error) => console.error('Failed to send invitations:', error),
      });
  }

  createEvent(eventRequest: EventRequest): Observable<Event> {
    return this.httpClient
      .post<Event>(environment.apiHost + '/api/events', eventRequest)
      .pipe(catchError(this.handleError));
  }

  getAgenda(eventId: number): Observable<Activity[]> {
    return this.httpClient
      .get<Activity[]>(environment.apiHost + `/api/events/${eventId}/agenda`)
      .pipe(catchError(this.handleError));
  }

  addActivity(eventId: number, activity: Activity): Observable<Activity> {
    return this.httpClient
      .post<Activity>(environment.apiHost + `/api/events/${eventId}/agenda`, {
        name: activity.name,
        description: activity.description,
        startTime: activity.startTime,
        endTime: activity.endTime,
        location: activity.location,
      })
      .pipe(catchError(this.handleError));
  }

  removeActivity(eventId: number, activityId: number) {
    return this.httpClient
      .delete(
        environment.apiHost + `/api/events/${eventId}/agenda/${activityId}`
      )
      .pipe(catchError(this.handleError));
  }

  addToFavorites(eventId: number): Observable<any> {
    const userId = this.authService.getUser()?.userId;
    return this.httpClient
      .post(environment.apiHost + `/api/users/${userId}/favorite-events`, {
        userId,
        eventId,
      })
      .pipe(catchError(this.handleError));
  }

  removeFromFavorites(eventId: number): Observable<void> {
    const userId = this.authService.getUser()?.userId;
    return this.httpClient
      .delete<void>(
        environment.apiHost + `/api/users/${userId}/favorite-events/${eventId}`
      )
      .pipe(catchError(this.handleError));
  }

  getFavoriteEvents(): Observable<HomeEvent[]> {
    const userId = this.authService.getUser()?.userId;
    return this.httpClient
      .get<HomeEvent[]>(
        environment.apiHost + `/api/users/${userId}/favorite-events`
      )
      .pipe(catchError(this.handleError));
  }

  getCalendarEvents(
    startDate: Date,
    endDate: Date
  ): Observable<CalendarEvent[]> {
    const userId = this.authService.getUser()?.userId;
    return this.httpClient
      .get<CalendarEvent[]>(
        environment.apiHost + `/api/users/${userId}/calendar`,
        {
          params: {
            startDate: this.datePipe.transform(startDate, 'yyyy-MM-dd')!,
            endDate: this.datePipe.transform(endDate, 'yyyy-MM-dd')!,
          },
        }
      )
      .pipe(catchError(this.handleError));
  }

  getAttendingEvents(startDate: Date, endDate: Date): Observable<HomeEvent[]> {
    const userId = this.authService.getUser()?.userId;
    return this.httpClient
      .get<HomeEvent[]>(
        environment.apiHost + `/api/events/attending/${userId}`,
        {
          params: {
            startDate: this.datePipe.transform(startDate, 'yyyy-MM-dd')!,
            endDate: this.datePipe.transform(endDate, 'yyyy-MM-dd')!,
          },
        }
      )
      .pipe(catchError(this.handleError));
  }

  getOrganizerEvents(startDate: Date, endDate: Date): Observable<HomeEvent[]> {
    const organizerId = this.authService.getUser()?.userId;
    return this.httpClient
      .get<HomeEvent[]>(
        environment.apiHost + `/api/events/organizer/${organizerId}`,
        {
          params: {
            startDate: this.datePipe.transform(startDate, 'yyyy-MM-dd')!,
            endDate: this.datePipe.transform(endDate, 'yyyy-MM-dd')!,
          },
        }
      )
      .pipe(catchError(this.handleError));
  }

  isAttending(eventId: number, userId: number): Observable<boolean> {
    return this.httpClient
      .get<boolean>(
        environment.apiHost + `/api/events/${eventId}/attending/${userId}`
      )
      .pipe(catchError(this.handleError));
  }

  joinEvent(eventId: number): Observable<HomeEvent> {
    const userId = this.authService.getUser()?.userId;
    return this.httpClient
      .post<HomeEvent>(environment.apiHost + `/api/events/${eventId}/join`, {
        userId,
      })
      .pipe(catchError(this.handleError));
  }

  getAttendees(
    eventId: number,
    page: number
  ): Observable<{ attendees: Attendee[]; totalAttendees: number }> {
    return this.httpClient
      .get<Page<Attendee>>(
        environment.apiHost + `/api/events/${eventId}/attendees`,
        {
          params: {
            page,
          },
        }
      )
      .pipe(
        map((page) => ({
          attendees: page.content,
          totalAttendees: page.totalElements,
        })),
        catchError(this.handleError)
      );
  }

  getReviewStats(eventId: number): Observable<ReviewStats> {
    return this.httpClient
      .get<ReviewStats>(
        environment.apiHost + `/api/reviews/event/${eventId}/stats`
      )
      .pipe(catchError(this.handleError));
  }

  downloadReport(eventId: number): Observable<Blob> {
    return this.httpClient
      .get(`${environment.apiHost}/api/events/${eventId}/report`, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((response) => response.body!),
        catchError(this.handleError)
      );
  }

  downloadStatsReport(eventId: number): Observable<Blob> {
    return this.httpClient
      .get(`${environment.apiHost}/api/events/${eventId}/stats/report`, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((response) => response.body!),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorResponse: ErrorResponse | null = null;

    if (error.error && typeof error.error === 'object') {
      errorResponse = error.error as ErrorResponse;
    }

    return throwError(
      () =>
        ({
          code: error.status,
          message: errorResponse?.message ?? error.message,
          errors: errorResponse?.errors,
        } as ErrorResponse)
    );
  }
}
