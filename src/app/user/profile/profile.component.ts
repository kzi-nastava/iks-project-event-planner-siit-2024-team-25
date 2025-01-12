import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Subscription, switchMap } from 'rxjs';
import { environment } from '../../../environment/environment';
import { UserRole } from '../../infrastructure/auth/model/user-role.model';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { EventOrganizer, Owner, User } from '../model/user.model';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  email?: string;
  user?: User | EventOrganizer | Owner;
  selectedTab = 0;
  UserRole = UserRole; // For template access
  private subscription: Subscription | undefined;

  profilePicture?: string;

  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.subscription = this.authService.user$
      .pipe(
        switchMap((user) => {
          if (!user) {
            this.email = undefined;
            this.user = undefined;
            return EMPTY;
          }
          this.email = user?.email;
          return this.userService.getUser(user!.userId);
        }),
      )
      .subscribe({
        next: (user: User | EventOrganizer | Owner) => {
          this.user = user;
          this.profilePicture = this.getProfilePictureUrl(user);
        },
        error: (err: ErrorResponse) => {
          console.error(err);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getProfilePictureUrl(user: User | undefined | null): string {
    if (!user) return 'placeholder-avatar.png';
    return environment.apiHost + `/api/users/${user.id}/profile-picture`;
  }

  setDefaultAvatar(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'placeholder-avatar.png';
  }

  refetchProfilePicture(): void {
    const cacheBuster = new Date().getTime();
    this.profilePicture =
      this.getProfilePictureUrl(this.user) + `?=${cacheBuster}`;
  }

  isEventOrganizer(user: User): user is EventOrganizer {
    return user.userRole === UserRole.EventOrganizer;
  }

  isOwner(user: User): user is Owner {
    return user.userRole === UserRole.Owner;
  }

  getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  onUserUpdate(user: User) {
    this.user = user;
    this.refetchProfilePicture();
  }
}
