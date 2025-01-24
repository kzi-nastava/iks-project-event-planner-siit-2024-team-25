import { Component, Inject, OnInit } from '@angular/core';
import { Notification } from './model/notification.model';
import { NotificationServiceService } from './service/notification-service.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { NotificationCategory } from './model/notification-category.model';
import { Router } from '@angular/router';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { UserRole } from '../../infrastructure/auth/model/user-role.model';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit {
  isLoading: boolean = false;
  notifications: Notification[] = [];
  currentPage: number = 0;
  currentUserId: number = -1;
  totalNotifications: number = 0;
  notificationsEnabled: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private notificationService: NotificationServiceService,
    private datePipe: DatePipe,
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUserId = data.userId;
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
    if (this.isLoading) return;
    this.isLoading = true;

    this.notificationService
      .getMyNotifications(this.currentPage)
      .subscribe((response) => {
        this.notifications = [
          ...this.notifications,
          ...response.currentNotifications,
        ];
        this.totalNotifications = response.totalNotifications;
        if (this.currentPage < response.totalPages) {
          this.currentPage++;
        }
        this.isLoading = false;
      });
  }

  onScroll() {
    const container = document.querySelector(
      '.notification-container'
    ) as HTMLElement;
    const bottom =
      container.scrollHeight === container.scrollTop + container.clientHeight;
    if (bottom) {
      this.loadNotifications();
    }
  }

  formatDate(dateTime?: Date) {
    return this.datePipe.transform(dateTime, 'yyyy:MM:dd HH:mm');
  }

  openNotification(notification: Notification) {
    this.toggleViewed(notification, true, null);

    if (notification.notificationCategory == NotificationCategory.EVENT) {
      this.router.navigate([`/event/${notification.entityId}`]);
    } else if (
      notification.notificationCategory == NotificationCategory.PRODUCT
    ) {
      this.router.navigate([`/products/${notification.entityId}`]);
    } else if (
      notification.notificationCategory == NotificationCategory.SERVICE
    ) {
      this.router.navigate([`/service/services/${notification.entityId}`]);
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
  }

  toggleViewed(
    notification: Notification,
    isViewed: boolean,
    event: Event | null
  ) {
    if (event) {
      event.stopPropagation();
    }
    if (notification.id) {
      this.notificationService
        .toggleViewed(notification.id, isViewed)
        .subscribe({
          next: (response: Notification) => {
            this.notifications.forEach((notification) => {
              if (notification.id === response.id) {
                notification.isViewed = response.isViewed;
              }
            });
          },
        });
    }
  }

  toggleNotifications($event: MatSlideToggleChange) {
    throw new Error('Method not implemented.');
  }
}
