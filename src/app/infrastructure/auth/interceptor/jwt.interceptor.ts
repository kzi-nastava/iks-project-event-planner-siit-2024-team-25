import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const authToken = authService.getToken();

  if (authToken) {
    const newReq = req.clone({
      headers: req.headers.append('Authorization', 'Bearer ' + authToken),
    });
    return next(newReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          authService.logOut();
          router.navigateByUrl('/user/login');
        }
        return throwError(() => err);
      }),
    );
  }

  return next(req);
};
