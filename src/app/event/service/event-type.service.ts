import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { EventType } from '../model/event.type.model';
import { environment } from '../../../environment/environment';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { OfferingCategory } from '../model/offering-category.model';

@Injectable({
  providedIn: 'root',
})
export class EventTypeService {
  constructor(private httpClient: HttpClient) {}

  getEventTypes(): Observable<EventType[]> {
    return this.httpClient
      .get<EventType[]>(environment.apiHost + '/api/event-types')
      .pipe(catchError(this.handleError));
  }

  getEventType(eventTypeId: number): Observable<EventType> {
    return this.httpClient
      .get<EventType>(environment.apiHost + `/api/event-types/${eventTypeId}`)
      .pipe(catchError(this.handleError));
  }

  addEventType(eventType: EventType): Observable<EventType> {
    return this.httpClient
      .post<EventType>(environment.apiHost + '/api/event-types', {
        name: eventType.name,
        description: eventType.description,
        categories: eventType.categories,
      })
      .pipe(catchError(this.handleError));
  }

  updateEventType(eventType: EventType): Observable<EventType> {
    return this.httpClient
      .put<EventType>(
        environment.apiHost + `/api/event-types/${eventType.id}`,
        {
          name: eventType.name,
          description: eventType.description,
          isActive: eventType.isActive,
          categories: eventType.categories,
        },
      )
      .pipe(catchError(this.handleError));
  }

  getOfferingCategories(): Observable<OfferingCategory[]> {
    const mockCategories: OfferingCategory[] = [
      { id: 1, name: 'Training' },
      { id: 2, name: 'Consultation' },
      { id: 3, name: 'Product Demo' },
      { id: 4, name: 'Mentorship' },
      { id: 5, name: 'Certification' },
    ];

    return of(mockCategories);
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
        }) as ErrorResponse,
    );
  }
}
