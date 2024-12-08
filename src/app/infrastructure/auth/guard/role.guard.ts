import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../service/auth.service';

export const roleGuard: CanActivateFn = (route, _state) => {
  return inject(AuthService).userRole$.pipe(
    map((userRole) => route.data['roles'].includes(userRole)),
  );
};
