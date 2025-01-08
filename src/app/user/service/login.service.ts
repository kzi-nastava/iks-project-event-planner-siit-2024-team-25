import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import { User } from '../../infrastructure/auth/model/user.model';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { LoginResponse } from '../model/login.response.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  login(email: string, password: string): Observable<void> {
    return this.httpClient
      .post<LoginResponse>(environment.apiHost + '/api/auth/login', {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          const user: User = {
            userId: response.userId,
            email: response.email,
            fullName: response.fullName,
            role: response.role,
            country: 'Serbia',
            city: 'Novi Sad',
            suspensionEndDateTime: response.suspensionEndDateTime,
          };
          if (!user.suspensionEndDateTime) {
            this.authService.setToken(response.jwt);
          }
          this.authService.setUser(user);
        }),
        catchError(this.handleError),
        map(() => void 0)
      );
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
        } as ErrorResponse)
    );
  }
}
