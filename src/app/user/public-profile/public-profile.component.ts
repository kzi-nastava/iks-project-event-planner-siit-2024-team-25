import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, map } from 'rxjs';
import { environment } from '../../../environment/environment';
import { UserRole } from '../../infrastructure/auth/model/user-role.model';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { EventOrganizer, Owner, User } from '../model/user.model';
import { ReportUserComponent } from '../report-user/report-user.component';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss'],
})
export class PublicProfileComponent implements OnInit, OnDestroy {
  user?: User | EventOrganizer | Owner;
  profilePicture?: string;
  UserRole = UserRole;

  companyPictureUrls: SafeUrl[] = [];
  private objectUrls: string[] = []; // for cleanup

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.params['id'];
    this.userService.getUser(userId).subscribe({
      next: (userData) => {
        this.user = userData;
        this.profilePicture = this.getProfilePictureUrl(userData);
        if (this.isOwner(userData)) {
          this.loadCompanyPictures(userData);
        }
      },
      error: (err: ErrorResponse) => {
        this.toastr.error(err.message, 'Failed to load user profile');
      },
    });
  }

  getProfilePictureUrl(user: User | undefined | null): string {
    if (!user) return 'placeholder-avatar.png';
    return environment.apiHost + `/api/users/${user.id}/profile-picture`;
  }

  setDefaultAvatar(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'placeholder-avatar.png';
  }

  loadCompanyPictures(owner: Owner) {
    if (owner.companyPictures.length) {
      const pictureObservables = owner.companyPictures.map((pictureId) =>
        this.userService.getCompanyPicture(owner.id, pictureId).pipe(
          map((blob) => {
            const objectUrl = URL.createObjectURL(blob);
            this.objectUrls.push(objectUrl);
            return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          }),
        ),
      );

      forkJoin(pictureObservables).subscribe({
        next: (urls: SafeUrl[]) => {
          this.companyPictureUrls = urls;
        },
        error: () => {
          this.toastr.error('Error loading company pictures');
        },
      });
    }
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

  getUserRoleDisplay(role: UserRole): string {
    switch (role) {
      case UserRole.Regular:
        return 'Just a regular folk';
      case UserRole.EventOrganizer:
        return 'Event Organizer';
      case UserRole.Owner:
        return 'Product/Service Provider';
      case UserRole.Admin:
        return 'Admin';
    }
    return '';
  }

  openReportDialog(): void {
    if (!this.user) return;

    this.dialog.open(ReportUserComponent, {
      width: '500px',
      data: { reportedUserId: this.user.id },
    });
  }

  ngOnDestroy(): void {
    this.objectUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });
  }
}
