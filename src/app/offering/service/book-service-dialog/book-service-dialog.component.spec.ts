import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookServiceDialogComponent } from './book-service-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../event/service/event.service';
import { OfferingServiceService } from '../offering-service.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { MaterialModule } from '../../../infrastructure/material/material.module';
import { CommonModule } from '@angular/common';
import { ServiceRoutingModule } from '../service-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Service } from '../model/service';
import { Offeringtype } from '../../model/offering.type.enum';
import { OfferingCategoryType } from '../../offering-category/model/offering-category-type.enum';
import { ReservationType } from '../model/reservation.type.enum';
import { Event } from '../../../event/model/event.model';
import { PurchaseRequest } from '../../model/purchase.request.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrivacyType } from '../../../event/model/privacy-type.model';
import { ErrorResponse } from '../../../shared/model/error.response.model';

describe('BookServiceComponent', () => {
  let component: BookServiceDialogComponent;
  let fixture: ComponentFixture<BookServiceDialogComponent>;
  let mockRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockServiceService: jasmine.SpyObj<OfferingServiceService>;
  let mockEventService: jasmine.SpyObj<EventService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  const mockService = {
    id: 1,
    name: 'Test service',
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
  };

  const mockServiceWithArrangement: Service = {
    id: 1,
    name: 'Test service',
    description: '',
    price: 2000,
    images: ['image1', 'image2'],
    discount: 0,
    visible: true,
    available: true,
    offeringType: Offeringtype.ACCEPTED,
    specifics: 'Specifics',
    duration: 0,
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
    minimumArrangement: 2,
    maximumArrangement: 4,
    owner: {
      id: 1,
      name: 'Pera Peric',
    },
    isFavorite: false,
  };

  const mockEvent = {
    id: 1,
    eventType: {
      id: 1,
      name: 'Event type 1',
    },
    name: 'Event 1',
    description: '',
    maxParticipants: 250,
    privacyType: PrivacyType.PUBLIC,
    startDate: new Date(2025, 1, 10),
    endDate: new Date(2025, 1, 15),
    startTime: '10:00',
    endTime: '10:00',
    location: {
      country: 'Srbija',
      city: 'Novi Sad',
      address: 'Stanoja Glavasa 22',
      latitude: 40,
      longitude: 20,
    },
    organizer: {
      id: 1,
      name: 'Pera Peric',
    },
    isFavorite: false,
  };

  const mockPurchaseRequest: PurchaseRequest = {
    startDate: undefined,
    endDate: undefined,
    startTime: undefined,
    endTime: undefined,
    price: 2000,
  };

  const mockPurchaseRequestValid: PurchaseRequest = {
    startDate: new Date(2025, 1, 10),
    endDate: new Date(2025, 1, 10),
    startTime: '10:00',
    endTime: '13:00',
    price: 2000,
  };

  beforeEach(async () => {
    mockServiceService = jasmine.createSpyObj('OfferingServiceService', [
      'getServiceById',
      'isServiceAvailable',
      'bookService',
    ]);
    mockToastrService = jasmine.createSpyObj('ToastrService', [
      'error',
      'success',
    ]);
    mockRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParams: of({}),
      params: of({}),
    });
    mockEventService = jasmine.createSpyObj('EventService', ['getEvent']);

    await TestBed.configureTestingModule({
      declarations: [BookServiceDialogComponent],
      imports: [
        MaterialModule,
        CommonModule,
        ServiceRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: OfferingServiceService, useValue: mockServiceService },
        { provide: EventService, useValue: mockEventService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookServiceDialogComponent);
    component = fixture.componentInstance;
    component.service = mockService;
    component.event = mockEvent;
    component.purchase = mockPurchaseRequest;
    component.errorMessage = undefined;
    component.setMinStartTime();
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize the form with mock data', () => {
      expect(component.event).toBe(mockEvent);
      expect(component.service).toBe(mockService);
      expect(component.eventStartTime).toBe('10:00');
      expect(component.purchase.price).toBe(mockPurchaseRequest.price);
    });
  });

  describe('Time change', () => {
    it('should calculate end time when start time changes for service with duration successfully', () => {
      component.purchase.startDate = mockEvent.startDate;
      component.purchase.startTime = mockEvent.startTime;
      mockServiceService.isServiceAvailable.and.returnValue(of(true));
      component.onStartTimeChange();

      expect(component.errorMessage).toBe(undefined);
      expect(component.purchase.endTime).toBe(mockPurchaseRequestValid.endTime);
      expect(component.isAvailable).toBeTruthy();
    });

    it('should calculate end time when start time changes for service with min/max arrangement successfully', () => {
      component.service = mockServiceWithArrangement;
      component.purchase.startDate = mockEvent.startDate;
      component.purchase.startTime = mockEvent.startTime;
      component.onStartTimeChange();

      expect(component.errorMessage).toBe(undefined);
      expect(component.minEndTime).toBe('12:00');
    });

    it('should handle when start time changes and start date is undefined', () => {
      component.purchase = { ...mockPurchaseRequestValid };
      component.purchase.startDate = undefined;
      component.purchase.endDate = undefined;
      component.purchase.endTime = undefined;
      component.onStartTimeChange();

      expect(component.errorMessage).toBe(undefined);
      expect(component.purchase.endTime).toBe(undefined);
    });

    it('should validate when end time changes for service with min/max arrangement successfully', () => {
      component.service = mockServiceWithArrangement;
      component.purchase = { ...mockPurchaseRequestValid };
      mockServiceService.isServiceAvailable.and.returnValue(of(true));
      component.onEndTimeChange();

      expect(component.errorMessage).toBe(undefined);
      expect(component.isAvailable).toBeTruthy();
    });

    it('should handle when end time changes for service with min/max arrangement', () => {
      component.service = mockServiceWithArrangement;
      component.purchase = { ...mockPurchaseRequestValid };
      component.purchase.endTime = '20:00';
      component.onEndTimeChange();

      expect(component.errorMessage).toBe(
        `The selected duration is outside the allowed range of ${component.service.minimumArrangement} to ${component.service.maximumArrangement} hours.`
      );
    });

    it('should handle when end time changes for service with min/max arrangement with undefined value', () => {
      component.service = mockServiceWithArrangement;
      component.purchase = { ...mockPurchaseRequestValid };
      component.purchase.startDate = undefined;
      component.isAvailable = true;
      component.onEndTimeChange();

      expect(component.errorMessage).toBe(undefined);
      expect(component.isAvailable).toBeTruthy();
    });
  });

  describe('Is service available', () => {
    it('should enable "book a service" button successfully', () => {
      mockServiceService.isServiceAvailable.and.returnValue(of(true));
      component.isServiceAvailable();
      fixture.detectChanges();
      expect(component.isAvailable).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector('[name="bookServiceButton"]')
          .disabled
      ).toBeFalse();
    });

    it('should disable "book a service" button successfully', () => {
      mockServiceService.isServiceAvailable.and.returnValue(of(false));
      component.isServiceAvailable();
      fixture.detectChanges();
      expect(component.isAvailable).toBeFalsy();
      expect(
        fixture.nativeElement.querySelector('[name="bookServiceButton"]')
          .disabled
      ).toBeTrue();
    });

    it('should show "Service is available for booking." successfully', () => {
      mockServiceService.isServiceAvailable.and.returnValue(of(true));

      component.isServiceAvailable();
      fixture.detectChanges();

      const availableElement =
        fixture.nativeElement.querySelector('.isAvailable.green');

      const unavailableElement =
        fixture.nativeElement.querySelector('.isAvailable.red');

      expect(component.isAvailable).toBeTruthy();
      expect(availableElement).toBeTruthy();
      expect(unavailableElement).toBeFalsy();
      expect(window.getComputedStyle(availableElement).display).not.toBe(
        'none'
      );
    });

    it('should show "Service is not available for booking." successfully', () => {
      mockServiceService.isServiceAvailable.and.returnValue(of(false));

      component.isServiceAvailable();
      fixture.detectChanges();

      const availableElement =
        fixture.nativeElement.querySelector('.isAvailable.red');
      const unavailableElement =
        fixture.nativeElement.querySelector('.isAvailable.green');

      expect(component.isAvailable).toBeFalsy();
      expect(availableElement).toBeTruthy();
      expect(unavailableElement).toBeFalsy();
      expect(window.getComputedStyle(availableElement).display).not.toBe(
        'none'
      );
    });
  });

  describe('Book a service', () => {
    const mockErrorResponse: ErrorResponse = {
      code: 400,
      message: 'Bad request',
      errors: {
        purcahse: 'Purchase request has invalid data.',
      },
    };

    const mockError404Response: ErrorResponse = {
      code: 404,
      message: 'Not found',
      errors: {
        service: 'Service not found',
      },
    };

    const mockError500Response: ErrorResponse = {
      code: 500,
      message: 'Internal Server Error',
      errors: {},
    };
    it('should book a service successfully', () => {
      mockServiceService.bookService.and.returnValue(of(true));
      component.bookService();

      expect(component.isAvailable).toBeFalsy();
      expect(mockToastrService.success).toHaveBeenCalled();
      expect(mockToastrService.error).not.toHaveBeenCalled();
    });
    it('should handle when unsuccessfully book a service', () => {
      component.isAvailable = true;
      mockServiceService.bookService.and.returnValue(of(false));
      component.bookService();

      expect(component.isAvailable).toBeTruthy();
      expect(mockToastrService.success).not.toHaveBeenCalled();
      expect(mockToastrService.error).not.toHaveBeenCalled();
    });
    it('should handle error 400', () => {
      component.isAvailable = true;
      mockServiceService.bookService.and.returnValue(
        throwError(() => mockErrorResponse)
      );
      component.bookService();

      expect(component.isAvailable).toBeTruthy();
      expect(mockToastrService.success).not.toHaveBeenCalled();
      expect(mockToastrService.error).toHaveBeenCalledOnceWith(
        mockErrorResponse.message,
        'Oops!'
      );
    });

    it('should handle error 500', () => {
      component.isAvailable = true;
      mockServiceService.bookService.and.returnValue(
        throwError(() => mockError500Response)
      );
      component.bookService();

      expect(component.isAvailable).toBeTruthy();
      expect(mockToastrService.success).not.toHaveBeenCalled();
      expect(mockToastrService.error).toHaveBeenCalledOnceWith(
        mockError500Response.message,
        'Oops!'
      );
    });

    it('should handle error 404', () => {
      component.isAvailable = true;
      mockServiceService.bookService.and.returnValue(
        throwError(() => mockError404Response)
      );
      component.bookService();

      expect(component.isAvailable).toBeTruthy();
      expect(mockToastrService.success).not.toHaveBeenCalled();
      expect(mockToastrService.error).toHaveBeenCalledOnceWith(
        mockError404Response.message,
        'Oops!'
      );
      expect(mockError404Response.errors).toEqual({
        service: 'Service not found',
      });
    });
  });
});
