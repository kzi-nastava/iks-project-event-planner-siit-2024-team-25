import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environment/environment';
import { UserRole } from '../../infrastructure/auth/model/user-role.model';
import { RegisterResponse } from '../model/register.response.model';
import { RegisterRequest } from '../model/user.request.model';
import { UserService } from './user.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ErrorResponse } from '../../shared/model/error.response.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const createMockEventOrganizerRequest = (): RegisterRequest => ({
    email: 'eventorganizer@test.com',
    password: 'TestPassword123!',
    firstName: 'John',
    lastName: 'Doe',
    userRole: 'EVENT_ORGANIZER',
    eventOrganizerFields: {
      livingAddress: {
        country: 'USA',
        city: 'New York',
        address: '123 Main St',
      },
      phoneNumber: '+1234567890',
    },
    profilePicture: new File(['test'], 'profile.jpg', { type: 'image/jpeg' }),
  });

  const createMockOwnerRequest = (): RegisterRequest => ({
    email: 'owner@test.com',
    password: 'TestPassword123!',
    firstName: 'Jane',
    lastName: 'Smith',
    userRole: 'OWNER',
    ownerFields: {
      companyName: 'Test Company',
      companyAddress: {
        country: 'USA',
        city: 'San Francisco',
        address: '456 Business Blvd',
      },
      contactPhone: '+0987654321',
      description: 'A test company',
      companyPictures: [
        new File(['test1'], 'company1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'company2.png', { type: 'image/png' }),
      ],
    },
  });

  const createMockSuccessResponse = (
    request: RegisterRequest
  ): RegisterResponse => ({
    email: request.email,
    fullName: `${request.firstName} ${request.lastName}`,
    userRole:
      request.userRole === 'OWNER' ? UserRole.Owner : UserRole.EventOrganizer,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('register method', () => {
    it('should register an event organizer successfully', () => {
      const mockRequest = createMockEventOrganizerRequest();
      const mockResponse = createMockSuccessResponse(mockRequest);

      service.register(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiHost}/api/auth/register`
      );
      expect(req.request.method).toBe('POST');

      // Verify FormData contents
      const formData = req.request.body as FormData;
      expect(formData.get('email')).toBe(mockRequest.email);
      expect(formData.get('password')).toBe(mockRequest.password);
      expect(formData.get('firstName')).toBe(mockRequest.firstName);
      expect(formData.get('lastName')).toBe(mockRequest.lastName);
      expect(formData.get('userRole')).toBe('EVENT_ORGANIZER');

      // Verify event organizer fields
      expect(formData.get('eventOrganizerFields.livingAddress.country')).toBe(
        mockRequest.eventOrganizerFields!.livingAddress.country
      );
      expect(formData.get('eventOrganizerFields.livingAddress.city')).toBe(
        mockRequest.eventOrganizerFields!.livingAddress.city
      );
      expect(formData.get('eventOrganizerFields.livingAddress.address')).toBe(
        mockRequest.eventOrganizerFields!.livingAddress.address
      );
      expect(formData.get('eventOrganizerFields.phoneNumber')).toBe(
        mockRequest.eventOrganizerFields!.phoneNumber
      );

      // Verify profile picture
      expect(formData.get('profilePicture')).toBeTruthy();

      req.flush(mockResponse);
    });

    it('should register an owner successfully', () => {
      const mockRequest = createMockOwnerRequest();
      const mockResponse = createMockSuccessResponse(mockRequest);

      service.register(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiHost}/api/auth/register`
      );
      expect(req.request.method).toBe('POST');

      // Verify FormData contents
      const formData = req.request.body as FormData;
      expect(formData.get('email')).toBe(mockRequest.email);
      expect(formData.get('password')).toBe(mockRequest.password);
      expect(formData.get('firstName')).toBe(mockRequest.firstName);
      expect(formData.get('lastName')).toBe(mockRequest.lastName);
      expect(formData.get('userRole')).toBe('OWNER');

      // Verify owner fields
      expect(formData.get('ownerFields.companyName')).toBe(
        mockRequest.ownerFields!.companyName
      );
      expect(formData.get('ownerFields.companyAddress.country')).toBe(
        mockRequest.ownerFields!.companyAddress.country
      );
      expect(formData.get('ownerFields.companyAddress.city')).toBe(
        mockRequest.ownerFields!.companyAddress.city
      );
      expect(formData.get('ownerFields.companyAddress.address')).toBe(
        mockRequest.ownerFields!.companyAddress.address
      );
      expect(formData.get('ownerFields.contactPhone')).toBe(
        mockRequest.ownerFields!.contactPhone
      );
      expect(formData.get('ownerFields.description')).toBe(
        mockRequest.ownerFields!.description
      );

      // Verify company pictures
      const companyPictures = mockRequest.ownerFields!.companyPictures!;
      expect(companyPictures.length).toBe(2);

      req.flush(mockResponse);
    });

    it('should register a user without profile picture', () => {
      const mockRequest = createMockEventOrganizerRequest();
      delete mockRequest.profilePicture;
      const mockResponse = createMockSuccessResponse(mockRequest);

      service.register(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiHost}/api/auth/register`
      );
      expect(req.request.method).toBe('POST');

      // Verify FormData contents
      const formData = req.request.body as FormData;
      expect(formData.get('profilePicture')).toBeNull();

      req.flush(mockResponse);
    });

    it('should handle registration error', () => {
      const mockRequest = createMockEventOrganizerRequest();
      const errorResponse: ErrorResponse = {
        code: 400,
        message: 'Registration failed',
        errors: {
          email: 'Email already exists',
        },
      };

      service.register(mockRequest).subscribe({
        error: (error: ErrorResponse) => {
          expect(error).toBeTruthy();
          expect(error.code).toBe(400);
          expect(error.message).toBe('Registration failed');
          expect(error.errors).toEqual({ email: 'Email already exists' });
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiHost}/api/auth/register`
      );
      req.flush(errorResponse, {
        status: errorResponse.code,
        statusText: 'Bad Request',
      });
    });

    it('should handle registration with minimal required fields', () => {
      const mockRequest: RegisterRequest = {
        email: 'minimal@test.com',
        password: 'MinimalPass123!',
        firstName: 'Min',
        lastName: 'User',
        userRole: 'EVENT_ORGANIZER',
        eventOrganizerFields: {
          livingAddress: {
            country: 'USA',
            city: 'Minimal City',
            address: '789 Minimal St',
          },
          phoneNumber: '+1111111111',
        },
      };
      const mockResponse = createMockSuccessResponse(mockRequest);

      service.register(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiHost}/api/auth/register`
      );
      expect(req.request.method).toBe('POST');

      // Verify FormData contents for minimal fields
      const formData = req.request.body as FormData;
      expect(formData.get('email')).toBe(mockRequest.email);
      expect(formData.get('userRole')).toBe('EVENT_ORGANIZER');

      req.flush(mockResponse);
    });
  });
});
