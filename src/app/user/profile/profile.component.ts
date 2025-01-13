import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Subscription, switchMap } from 'rxjs';
import { environment } from '../../../environment/environment';
import { UserRole } from '../../infrastructure/auth/model/user-role.model';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { DeactivateConfirmDialogComponent } from '../deactivate-confirm-dialog/deactivate-confirm-dialog.component';
import { EventOrganizer, Owner, User } from '../model/user.model';
import { PasswordResetDialogComponent } from '../password-reset-dialog/password-reset-dialog.component';
import { AccountService } from '../service/account.service';
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

  private canDeactivate: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private accountService: AccountService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
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

    this.accountService.canDeactivateAccount().subscribe({
      next: (canDeactivate) => {
        this.canDeactivate = canDeactivate;
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

  openPasswordResetDialog() {
    this.dialog.open(PasswordResetDialogComponent, {
      width: '500px',
    });
  }

  openDeactivateAccountDialog() {
    if (this.canDeactivate) {
      const dialogRef = this.dialog.open(DeactivateConfirmDialogComponent, {
        width: '500px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.accountService.deactivateAccount().subscribe({
            next: () => {
              this.toastr.success(
                'Your account has been permanently deactivated.',
              );
              this.authService.logOut();
              this.router.navigate(['/']);
            },
            error: (err: ErrorResponse) => {
              this.toastr.error(err.message, 'Failed to deactivate account');
            },
          });
        }
      });
    } else {
      this.toastr.warning(
        'Cannot deactivate account because there are pending purchases!',
      );
    }
  }
}
