import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ErrorResponse } from '../../shared/model/error.response.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private httpClient: HttpClient) {}

  public resetPassword(
    oldPassword: string,
    newPassword: string,
  ): Observable<void> {
    return this.httpClient
      .put<void>(environment.apiHost + '/api/auth/password-reset', {
        oldPassword,
        newPassword,
      })
      .pipe(catchError(this.handleError));
  }

  public canDeactivateAccount(): Observable<boolean> {
    return this.httpClient
      .get<CanDeactivateResponse>(
        environment.apiHost + '/api/auth/can-deactivate',
      )
      .pipe(
        map((dto) => dto.canDeactivate),
        catchError(this.handleError),
      );
  }

  public deactivateAccount(): Observable<void> {
    return this.httpClient
      .delete<void>(environment.apiHost + '/api/auth/deactivate')
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

interface CanDeactivateResponse {
  canDeactivate: boolean;
}
