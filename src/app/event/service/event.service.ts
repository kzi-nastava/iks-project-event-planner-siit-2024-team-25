import { Injectable } from '@angular/core';
import { HomeEvent } from '../model/home-event.model';
import { map, Observable, of } from 'rxjs';
import { HomeEventFilterParams } from '../model/home.event.filter.param.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../shared/model/page.mode';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { EventInvitation } from '../model/event.invitation.model';
import { DatePipe, Time } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {}

  getTopEvents(): Observable<HomeEvent[]> {
    const user = this.authService.getUser();

    let params = new HttpParams();

    if (user) {
      params = params.set('country', user.country ?? '');
      params = params.set('city', user.city ?? '');
    }

    return this.httpClient
      .get<Page<HomeEvent>>('http://localhost:8080/api/events/top', { params })
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
      .get<Page<HomeEvent>>('http://localhost:8080/api/events/all', { params })
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
        `http://localhost:8080/api/events/${eventId}/send-invitations`,
        invitations
      )
      .subscribe({
        next: () => console.log('Invitations sent successfully.'),
        error: (error) => console.error('Failed to send invitations:', error),
      });
  }
}
