import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { UserRole } from '../model/user-role.model';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user = new BehaviorSubject<User | null>(null);

  user$: Observable<User | null> = this.user.asObservable();

  loggedIn$: Observable<boolean> = this.user$.pipe(
    map((user) => user !== null),
  );

  userRole$: Observable<UserRole | null> = this.user$.pipe(
    map((user) => user?.role ?? UserRole.Unauthenticated),
  );

  getUser(): User | null {
    return this.user.getValue();
  }

  setUser(user: User | null) {
    this.user.next(user);
  }

  logOut() {
    this.user.next(null);
  }
}
