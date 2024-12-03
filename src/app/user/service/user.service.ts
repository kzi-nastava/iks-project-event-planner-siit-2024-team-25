import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../../environment/environment';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { RegisterRequest } from '../model/register.request.model';
import { RegisterResponse } from '../model/register.response.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  public register(
    registerRequest: RegisterRequest,
  ): Observable<RegisterResponse> {
    const formData = new FormData();

    formData.append('email', registerRequest.email);
    formData.append('password', registerRequest.password);
    formData.append('firstName', registerRequest.firstName);
    formData.append('lastName', registerRequest.lastName);
    formData.append('userRole', registerRequest.userRole);

    if (registerRequest.userRole === 'OWNER' && registerRequest.ownerFields) {
      formData.append(
        'ownerFields.companyName',
        registerRequest.ownerFields.companyName,
      );
      formData.append(
        'ownerFields.companyAddress.country',
        registerRequest.ownerFields.companyAddress.country,
      );
      formData.append(
        'ownerFields.companyAddress.city',
        registerRequest.ownerFields.companyAddress.city,
      );
      formData.append(
        'ownerFields.companyAddress.address',
        registerRequest.ownerFields.companyAddress.address,
      );
      formData.append(
        'ownerFields.contactPhone',
        registerRequest.ownerFields!.contactPhone,
      );
      formData.append(
        'ownerFields.description',
        registerRequest.ownerFields.description || '',
      );

      for (let file of registerRequest.ownerFields!.companyPictures ?? []) {
        formData.append('ownerFields.companyPictures', file, file.name);
      }
    }

    if (
      registerRequest.userRole === 'EVENT_ORGANIZER' &&
      registerRequest.eventOrganizerFields
    ) {
      formData.append(
        'eventOrganizerFields.livingAddress.country',
        registerRequest.eventOrganizerFields.livingAddress.country,
      );
      formData.append(
        'eventOrganizerFields.livingAddress.city',
        registerRequest.eventOrganizerFields.livingAddress.city,
      );
      formData.append(
        'eventOrganizerFields.livingAddress.address',
        registerRequest.eventOrganizerFields.livingAddress.address,
      );
      formData.append(
        'eventOrganizerFields.phoneNumber',
        registerRequest.eventOrganizerFields.phoneNumber,
      );
    }

    if (registerRequest.profilePicture) {
      formData.append(
        'profilePicture',
        registerRequest.profilePicture,
        registerRequest.profilePicture.name,
      );
    }

    return this.httpClient
      .post<RegisterResponse>(
        environment.apiHost + '/api/auth/register',
        formData,
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
        }) as ErrorResponse,
    );
  }
}
