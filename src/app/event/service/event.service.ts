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
import { EventInvitation } from '../model/event.invitation.model';

import { Event } from '../model/event.model';

import { EventRequest } from '../model/event.request.model';
import { HomeEvent } from '../model/home-event.model';
import { HomeEventFilterParams } from '../model/home.event.filter.param.model';


@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {}


  getEvent(eventId: number): Observable<Event> {
    return this.httpClient
      .get<Event>(environment.apiHost + `/api/events/${eventId}`)
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

    console.log(filterParams?.startTime);
    console.log(filterParams?.endTime);

    params = params.set('page', page);

    console.log(params);

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

    let params = new HttpParams();

    if (user) {
      params = params.set('country', user.country ?? '');
      params = params.set('city', user.city ?? '');
    }

    return this.httpClient
      .get<Page<HomeEvent>>(`${environment.apiHost}/api/events/top`, { params })
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
