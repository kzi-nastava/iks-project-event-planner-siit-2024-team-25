import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
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
