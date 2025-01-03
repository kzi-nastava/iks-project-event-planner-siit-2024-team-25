import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import * as Stomp from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../../environment/environment';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { Page } from '../../../shared/model/page.mode';
import { Notification } from '../model/notification.model';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NotificationServiceService {
  private stompClient: any;
  private notificationsSubject = new Subject<Notification>();
  public notifications$ = this.notificationsSubject.asObservable();
  private serverUrl = environment.apiHost + '/socket';
  isLoaded = false;

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {
    this.connect();
  }

  private connect() {
    this.authService.user$.subscribe({
      next: (user) => {
        if (user) {
          this.stompClient = Stomp.Stomp.client(this.serverUrl);
          let that = this;

          this.stompClient.connect({}, (frame: Stomp.Frame) => {
            that.isLoaded = true;
            that.openSocket(user.userId);
          });
        } else {
          this.stompClient.disconnect(() => {
            console.log('Disconnected from WebSocket');
          });
        }
      },
      error: () => {
        this.stompClient.disconnect(() => {
          console.log('Disconnected from WebSocket');
        });
      },
    });
  }

  openSocket(userId: number) {
    this.stompClient.subscribe(
      `/notifications/user/${userId}`,
      (message: { body: string }) => {
        this.handleResult(message);
      }
    );
  }
  handleResult(message: { body: string }) {
    if (message.body) {
      const notification: Notification = JSON.parse(message.body);
      this.notificationsSubject.next(notification);
    }
  }

  getMyNotifications(
    userId: number,
    page: number
  ): Observable<{
    currentNotifications: Notification[];
    totalNotifications: number;
    totalPages: number;
  }> {
    let params = new HttpParams();
    params = params.set('page', page);

    return this.httpClient
      .get<Page<Notification>>(
        `${environment.apiHost}/api/notifications/${userId}`,
        { params }
      )
      .pipe(
        map((page) => ({
          currentNotifications: page.content,
          totalNotifications: page.totalElements,
          totalPages: page.totalPages,
        }))
      );
  }

  toggleViewed(
    userId: number,
    notificationId: number,
    isViewed: boolean
  ): Observable<Notification> {
    const notificationRequest = {
      id: notificationId,
      isViewed: isViewed,
    };
    return this.httpClient.put(
      `${environment.apiHost}/api/notifications/${userId}/view`,
      notificationRequest
    );
  }
}
