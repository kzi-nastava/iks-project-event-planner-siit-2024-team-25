import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, shareReplay } from 'rxjs';
import { UserRole } from '../../infrastructure/auth/model/user-role.model';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { NotificationServiceService } from '../../communication/notification/service/notification-service.service';
import { ToastrService } from 'ngx-toastr';
import { Notification } from '../../communication/notification/model/notification.model';
import { NotificationCategory } from '../../communication/notification/model/notification-category.model';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '../../communication/notification/notification.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit {
  notifications: Notification[] = [];
  isExpanded = false;

  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private notificationService: NotificationServiceService,
    private toastrService: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(
      (notification: Notification) => {
        const toast = this.toastrService.info(
          notification.message,
          notification.title,
          {
            closeButton: true,
            tapToDismiss: false,
          }
        );

        toast.onTap.subscribe(() => {
          if (notification.notificationCategory == NotificationCategory.EVENT) {
            this.router.navigate([`/event/${notification.entityId}`]);
          } else if (
            notification.notificationCategory == NotificationCategory.PRODUCT
          ) {
            ///TODO
            // this.router.navigate([`/product/${notification.entityId}`]);
          } else if (
            notification.notificationCategory == NotificationCategory.SERVICE
          ) {
            this.router.navigate([
              `/service/services/${notification.entityId}`,
            ]);
          } else if (
            notification.notificationCategory ==
            NotificationCategory.OFFERING_CATEGORY
          ) {
            if (this.authService.getUser()?.role == UserRole.Admin) {
              this.router.navigate([`/offering-category/offering-categories`]);
            } else {
              this.router.navigate([`/my-offerings`]);
            }
          }
        });

        this.notifications.push(notification);
      }
    );
  }

  loggedIn$ = this.authService.loggedIn$;

  isOwner$ = this.authService.userRole$.pipe(
    map((role) => role == UserRole.Owner)
  );

  isOrganizer$ = this.authService.userRole$.pipe(
    map((role) => role == UserRole.EventOrganizer)
  );

  isAdmin$ = this.authService.userRole$.pipe(
    map((role) => role == UserRole.Admin)
  );

  isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
    map((result) => result.matches),
    shareReplay()
  );

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  openNotifications() {
    const currentUserId = this.authService.getUser()?.userId;

    this.dialog.open(NotificationComponent, {
      width: '400px',
      data: { userId: currentUserId },
    });
  }
}
