import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { EventService } from './event.service';
import { Event } from '../model/event.model';
import { PrivacyType } from '../model/privacy-type.model';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { DatePipe } from '@angular/common';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  const createMockEvent = (): Event => ({
    id: 1,
    eventType: {
      id: 1,
      name: 'Event type 1',
    },
    name: '',
    privacyType: PrivacyType.PUBLIC,
    startDate: new Date(2026, 1, 10),
    endDate: new Date(2026, 1, 15),
    startTime: '10:00',
    endTime: '12:00',
    location: {
      country: 'Srbija',
      city: 'Uzice',
      address: 'Stanoja Glavasa 25',
      latitude: 40,
      longitude: 20,
    },
    organizer: {
      id: 1,
      name: 'Pera Peric',
    },
    isFavorite: false,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventService,
        provideHttpClient(),
        provideHttpClientTesting(),
        DatePipe,
      ],
    });

    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Get event by id', () => {
    it('should get event successfully', () => {
      const mockRequest = 1;
      const mockResponse = createMockEvent();

      service.getEvent(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiHost}/api/events/${mockRequest}`
      );
      expect(req.request.url).toBe(`${environment.apiHost}/api/events/1`);
      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);
    });

    it('should not get event', () => {
      const mockRequest = 0;
      const mockErrorResponse: ErrorResponse = {
        code: 404,
        message: 'Not found',
        errors: {
          event: 'Event not found',
        },
      };

      service.getEvent(mockRequest).subscribe({
        next: () => fail('Expected request to fail, but it succeeded.'),
        error: (error: ErrorResponse) => {
          expect(error.code).toEqual(404);
          expect(error.message).toEqual('Not found');
          expect(error.errors).toEqual({ event: 'Event not found' });
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiHost}/api/events/${mockRequest}`
      );

      expect(req.request.url).toBe(`${environment.apiHost}/api/events/0`);
      expect(req.request.method).toBe('GET');

      req.flush(mockErrorResponse, { status: 404, statusText: 'Not Found' });
    });
  });
});
