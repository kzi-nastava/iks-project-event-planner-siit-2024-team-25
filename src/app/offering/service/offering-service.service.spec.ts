import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { OfferingServiceService } from './offering-service.service';
import { Service } from './model/service';
import { Offeringtype } from '../model/offering.type.enum';
import { ReservationType } from './model/reservation.type.enum';
import { EventType } from '../model/event-type';
import { OfferingCategoryType } from '../offering-category/model/offering-category-type.enum';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { DatePipe } from '@angular/common';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { PurchaseRequest } from '../model/purchase.request.model';

describe('OffeirngServiceService', () => {
  let service: OfferingServiceService;
  let httpMock: HttpTestingController;

  const createMockServiceWithDurationResponse = (): Service => ({
    id: 1,
    name: '',
    description: '',
    price: 2000,
    images: ['image1', 'image2'],
    discount: 0,
    visible: true,
    available: true,
    offeringType: Offeringtype.ACCEPTED,
    specifics: 'Specifics',
    duration: 3,
    cancellationDeadline: 24,
    reservationDeadline: 24,
    reservationType: ReservationType.MANUAL,
    eventTypes: [
      {
        id: 1,
        name: 'Event type 1',
      },
      {
        id: 2,
        name: 'Event type 2',
      },
    ],
    offeringCategory: {
      id: 1,
      name: 'Offering category 1',
      description: 'Test offering category',
      status: OfferingCategoryType.ACCEPTED,
    },
    minimumArrangement: 0,
    maximumArrangement: 0,
    owner: {
      id: 1,
      name: 'Pera Peric',
    },
    isFavorite: false,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OfferingServiceService,
        provideHttpClient(),
        provideHttpClientTesting(),
        DatePipe,
      ],
    });

    service = TestBed.inject(OfferingServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Get service by id', () => {
    it('should get service successfully', () => {
      const mockRequest = 1;
      const mockResponse = createMockServiceWithDurationResponse();

      service.getServiceById(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiHost}/api/services/${mockRequest}`
      );
      expect(req.request.url).toBe(`${environment.apiHost}/api/services/1`);
      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);
    });

    it('should not get service', () => {
      const mockRequest = 5;
      const mockErrorResponse: ErrorResponse = {
        code: 404,
        message: 'Not found',
        errors: {
          service: 'Service not found',
        },
      };

      service.getServiceById(mockRequest).subscribe({
        next: () => fail('Expected request to fail, but it succeeded.'),
        error: (error: ErrorResponse) => {
          expect(error.code).toEqual(404);
          expect(error.message).toEqual('Not found');
          expect(error.errors).toEqual({ service: 'Service not found' });
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiHost}/api/services/${mockRequest}`
      );

      expect(req.request.url).toBe(`${environment.apiHost}/api/services/5`);
      expect(req.request.method).toBe('GET');

      req.flush(mockErrorResponse, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('Is service available', () => {
    it('should check is service available successfully', () => {
      const serviceId = 1;
      const mockPurchaseRequest: PurchaseRequest = {
        startDate: new Date(2025, 1, 10),
        endDate: new Date(2025, 1, 10),
        startTime: '10:00',
        endTime: '12:00',
        price: 100,
      };
      const mockResponse: boolean = true;

      service
        .isServiceAvailable(serviceId, mockPurchaseRequest)
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
        });

      const req = httpMock.expectOne((request) => {
        return (
          request.url ===
          `${environment.apiHost}/api/purchase/service/${serviceId}/available`
        );
      });

      expect(req.request.url).toBe(
        `${environment.apiHost}/api/purchase/service/1/available`
      );
      expect(req.request.method).toBe('GET');

      const sentParams = req.request.params.keys();
      expect(sentParams).toContain('startDate');
      expect(sentParams).toContain('endDate');
      expect(sentParams).toContain('startTime');
      expect(sentParams).toContain('endTime');
      expect(sentParams).not.toContain('price');

      expect(req.request.params.get('startDate')).toBe('2025-02-10');
      expect(req.request.params.get('endDate')).toBe('2025-02-10');
      expect(req.request.params.get('startTime')).toBe('10:00');
      expect(req.request.params.get('endTime')).toBe('12:00');

      req.flush(mockResponse);
    });

    it('should handle when service is not available', () => {
      const serviceId = 1;
      const mockPurchaseRequest: PurchaseRequest = {
        startDate: new Date(2025, 1, 10),
        endDate: new Date(2025, 1, 10),
        startTime: '10:00',
        endTime: '12:00',
        price: 100,
      };
      const mockResponse: boolean = false;

      service
        .isServiceAvailable(serviceId, mockPurchaseRequest)
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
        });

      const req = httpMock.expectOne((request) => {
        return (
          request.url ===
          `${environment.apiHost}/api/purchase/service/${serviceId}/available`
        );
      });

      expect(req.request.url).toBe(
        `${environment.apiHost}/api/purchase/service/1/available`
      );
      expect(req.request.method).toBe('GET');

      const sentParams = req.request.params.keys();
      expect(sentParams).toContain('startDate');
      expect(sentParams).toContain('endDate');
      expect(sentParams).toContain('startTime');
      expect(sentParams).toContain('endTime');
      expect(sentParams).not.toContain('price');

      expect(req.request.params.get('startDate')).toBe('2025-02-10');
      expect(req.request.params.get('endDate')).toBe('2025-02-10');
      expect(req.request.params.get('startTime')).toBe('10:00');
      expect(req.request.params.get('endTime')).toBe('12:00');

      req.flush(mockResponse);
    });
  });

  describe('Book a service', () => {
    it('should book a service successfully', () => {
      const eventId = 1;
      const serviceId = 2;
      const mockPurchaseRequest: PurchaseRequest = {
        startDate: new Date(2025, 1, 10),
        endDate: new Date(2025, 1, 10),
        startTime: '10:00',
        endTime: '12:00',
        price: 100,
      };
      const mockResponse = true;
      service
        .bookService(eventId, serviceId, mockPurchaseRequest)
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
        });

      const req = httpMock.expectOne(
        `${environment.apiHost}/api/purchase/event/${eventId}/service/${serviceId}`
      );

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockPurchaseRequest);

      req.flush(mockResponse);
    });

    describe('Handle Not found error', () => {
      it('should handle 404 Service not found error', () => {
        const eventId = 1;
        const serviceId = 25;
        const mockPurchaseRequest: PurchaseRequest = {
          startDate: new Date(2025, 1, 10),
          endDate: new Date(2025, 1, 10),
          startTime: '10:00',
          endTime: '12:00',
          price: 100,
        };
        const mockErrorResponse: ErrorResponse = {
          code: 404,
          message: 'Book a service failed',
          errors: {
            service: 'Service not found',
          },
        };
        service.bookService(eventId, serviceId, mockPurchaseRequest).subscribe({
          next: () => fail('Expected 404 error, but got a response'),
          error: (error: ErrorResponse) => {
            expect(error.code).toBe(404);
            expect(error.message).toBe('Book a service failed');
            expect(error.errors).toEqual({ service: 'Service not found' });
          },
        });

        const req = httpMock.expectOne(
          `${environment.apiHost}/api/purchase/event/${eventId}/service/${serviceId}`
        );

        expect(req.request.method).toBe('POST');

        req.flush(mockErrorResponse, { status: 404, statusText: 'Not Found' });
      });

      it('should handle 404 Event not found error', () => {
        const eventId = 0;
        const serviceId = 1;
        const mockPurchaseRequest: PurchaseRequest = {
          startDate: new Date(2025, 1, 10),
          endDate: new Date(2025, 1, 10),
          startTime: '10:00',
          endTime: '12:00',
          price: 100,
        };
        const mockErrorResponse: ErrorResponse = {
          code: 404,
          message: 'Book a service failed',
          errors: {
            event: 'Event not found',
          },
        };
        service.bookService(eventId, serviceId, mockPurchaseRequest).subscribe({
          next: () => fail('Expected 404 error, but got a response'),
          error: (error: ErrorResponse) => {
            expect(error.code).toBe(404);
            expect(error.message).toBe('Book a service failed');
            expect(error.errors).toEqual({ event: 'Event not found' });
          },
        });

        const req = httpMock.expectOne(
          `${environment.apiHost}/api/purchase/event/${eventId}/service/${serviceId}`
        );

        expect(req.request.method).toBe('POST');

        req.flush(mockErrorResponse, { status: 404, statusText: 'Not Found' });
      });
    });

    it('should handle 500 Internal Server Error', () => {
      const eventId = 1;
      const serviceId = 2;
      const mockPurchaseRequest: PurchaseRequest = {
        startDate: new Date(2025, 1, 10),
        endDate: new Date(2025, 1, 10),
        startTime: '10:00',
        endTime: '12:00',
        price: 100,
      };
      const mockErrorResponse: ErrorResponse = {
        code: 500,
        message: 'Internal Server Error',
        errors: {},
      };
      service.bookService(eventId, serviceId, mockPurchaseRequest).subscribe({
        next: () => fail('Expected 500 error, but got a response'),
        error: (error: ErrorResponse) => {
          expect(error.code).toBe(500);
          expect(error.message).toBe('Internal Server Error');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiHost}/api/purchase/event/${eventId}/service/${serviceId}`
      );

      expect(req.request.method).toBe('POST');

      req.flush(mockErrorResponse, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });

    it('should send correct request body', () => {
      const eventId = 1;
      const serviceId = 2;
      const mockPurchaseRequest: PurchaseRequest = {
        startDate: new Date(2025, 1, 10),
        endDate: new Date(2025, 1, 10),
        startTime: '10:00',
        endTime: '12:00',
        price: 100,
      };
      const mockResponse = true;
      service.bookService(eventId, serviceId, mockPurchaseRequest).subscribe();

      const req = httpMock.expectOne(
        `${environment.apiHost}/api/purchase/event/1/service/2`
      );

      expect(req.request.body.startDate).toBe(mockPurchaseRequest.startDate);
      expect(req.request.body.endDate).toBe(mockPurchaseRequest.endDate);
      expect(req.request.body.startTime).toBe(mockPurchaseRequest.startTime);
      expect(req.request.body.endTime).toBe(mockPurchaseRequest.endTime);
      expect(req.request.body.price).toBe(mockPurchaseRequest.price);

      req.flush(mockResponse);
    });

    it('should handle incorect request body', () => {
      const eventId = 1;
      const serviceId = 2;
      const mockPurchaseRequest: PurchaseRequest = {
        startDate: new Date(2025, 1, 10),
        endDate: new Date(2025, 1, 10),
        startTime: '10:00',
        endTime: '12:00',
        price: 100,
      };
      const mockErrorResponse: ErrorResponse = {
        code: 400,
        message: 'Bad request',
        errors: {
          purcahse: 'Service is not available in this period.',
        },
      };
      service.bookService(eventId, serviceId, mockPurchaseRequest).subscribe({
        next: () => fail('Expected 500 error, but got a response'),
        error: (error: ErrorResponse) => {
          expect(error.code).toBe(400);
          expect(error.message).toBe('Bad request');
          expect(error.errors).toEqual({
            purcahse: 'Service is not available in this period.',
          });
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiHost}/api/purchase/event/${eventId}/service/${serviceId}`
      );

      expect(req.request.method).toBe('POST');

      req.flush(mockErrorResponse, {
        status: 400,
        statusText: 'Internal Server Error',
      });
    });
  });
});
