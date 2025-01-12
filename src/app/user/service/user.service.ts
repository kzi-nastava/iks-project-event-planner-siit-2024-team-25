import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

import { environment } from '../../../environment/environment';
import { UserRole } from '../../infrastructure/auth/model/user-role.model';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { RegisterQuickRequest } from '../model/register.quick.request.model';
import { RegisterQuickResponse } from '../model/register.quick.response.model';
import { RegisterResponse } from '../model/register.response.model';
import { EventOrganizer, Owner, User } from '../model/user.model';
import {
  OwnerFields,
  RegisterRequest,
  UserRequest,
} from '../model/user.request.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  quickRegister(
    registerRequest: RegisterQuickRequest,
  ): Observable<RegisterQuickResponse> {
    const formData = new FormData();

    formData.append('email', registerRequest.email);
    formData.append('password', registerRequest.password);
    formData.append('firstName', registerRequest.firstName);
    formData.append('lastName', registerRequest.lastName);
    formData.append('userRole', registerRequest.userRole);
    if (registerRequest.invitationCode) {
      formData.append('invitationCode', registerRequest.invitationCode);
    }
    if (registerRequest.profilePicture) {
      formData.append('profilePicture', registerRequest.profilePicture);
    }

    return this.httpClient
      .post<RegisterQuickResponse>(
        environment.apiHost + '/api/auth/register/quick',
        formData,
      )
      .pipe(catchError(this.handleError));
  }

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

  public activateAccount(activationCode: string): Observable<void> {
    return this.httpClient
      .post<void>(environment.apiHost + '/api/auth/activate', {
        verificationCode: activationCode,
      })
      .pipe(catchError(this.handleError));
  }

  public getUser(userId: number): Observable<User | EventOrganizer | Owner> {
    return this.httpClient
      .get<
        User | EventOrganizer | Owner
      >(environment.apiHost + `/api/users/${userId}`)
      .pipe(
        map((user) => {
          if (user.userRole === UserRole.Owner) {
            return user as Owner;
          } else if (user.userRole === UserRole.EventOrganizer) {
            return user as EventOrganizer;
          }
          return user;
        }),
        catchError(this.handleError),
      );
  }

  public updateUser(userId: number, user: UserRequest): Observable<User> {
    const formData = new FormData();

    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);

    if (user.profilePicture) {
      formData.append(
        'profilePicture',
        user.profilePicture,
        user.profilePicture.name,
      );
    }

    formData.append(
      'removeProfilePicture',
      !!user.removeProfilePicture ? 'true' : 'false',
    );

    formData.append('userRole', user.userRole);

    if (user.userRole === 'OWNER' && user.ownerFields) {
      formData.append('ownerFields.companyName', user.ownerFields.companyName);
      formData.append(
        'ownerFields.companyAddress.country',
        user.ownerFields.companyAddress.country,
      );
      formData.append(
        'ownerFields.companyAddress.city',
        user.ownerFields.companyAddress.city,
      );
      formData.append(
        'ownerFields.companyAddress.address',
        user.ownerFields.companyAddress.address,
      );
      formData.append(
        'ownerFields.contactPhone',
        user.ownerFields.contactPhone,
      );
      formData.append(
        'ownerFields.description',
        user.ownerFields.description || '',
      );

      for (const file of user.ownerFields.companyPictures ?? []) {
        formData.append('ownerFields.companyPictures', file, file.name);
      }
    }

    if (user.userRole === 'EVENT_ORGANIZER' && user.eventOrganizerFields) {
      formData.append(
        'eventOrganizerFields.livingAddress.country',
        user.eventOrganizerFields.livingAddress.country,
      );
      formData.append(
        'eventOrganizerFields.livingAddress.city',
        user.eventOrganizerFields.livingAddress.city,
      );
      formData.append(
        'eventOrganizerFields.livingAddress.address',
        user.eventOrganizerFields.livingAddress.address,
      );
      formData.append(
        'eventOrganizerFields.phoneNumber',
        user.eventOrganizerFields.phoneNumber,
      );
    }

    return this.httpClient
      .put<User>(environment.apiHost + `/api/users/${userId}`, formData)
      .pipe(catchError(this.handleError));
  }

  public updateCompanyInfo(
    owner: Owner,
    companyInfo: OwnerFields,
  ): Observable<User> {
    const userRequest: UserRequest = {
      firstName: owner.firstName,
      lastName: owner.lastName,
      profilePicture: null,
      userRole: 'OWNER',
      ownerFields: companyInfo,
    };
    return this.updateUser(owner.id, userRequest);
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
