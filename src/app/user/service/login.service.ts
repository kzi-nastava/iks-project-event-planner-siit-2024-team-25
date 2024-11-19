import { Injectable } from '@angular/core';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { UserRole } from '../../infrastructure/auth/model/user-role.model';
import { User } from '../../infrastructure/auth/model/user.model';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private authService: AuthService) {}

  login(email: string, password: string): Observable<void> {
    return this.simulateLoginRequest(email, password).pipe(
      tap((user: User) => this.authService.setUser(user)),
      catchError((err) => {
        return throwError(() => new Error(err.message));
      }),
      map(() => void 0)
    );
  }

  // TODO: make an actual server request
  private simulateLoginRequest(
    email: string,
    password: string
  ): Observable<User> {
    try {
      let user = this.getMockedUser(email, password);
      return of(user).pipe(
        delay(1000) // simulate network delay
      );
    } catch (e) {
      const err = e as Error;
      return throwError(() => new Error(err.message));
    }
  }

  private getMockedUser(email: string, password: string): User {
    let role = UserRole.Regular;

    switch (password) {
      case 'organizer123':
        role = UserRole.EventOrganizer;
        break;
      case 'owner123':
        role = UserRole.Owner;
        break;
      case 'admin123':
        role = UserRole.Admin;
        break;
      case 'error123':
        throw new Error('Invalid credentials!');
    }

    return {
      userId: 1,
      email,
      fullName: 'John Doe',
      role,
    };
  }
}
