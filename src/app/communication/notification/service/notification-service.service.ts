import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as Stomp from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../../environment/environment';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationServiceService {
  private stompClient: any;
  private notificationsSubject = new Subject<Notification>();
  public notifications$ = this.notificationsSubject.asObservable();
  private serverUrl = environment.apiHost + '/socket';
  isLoaded = false;

  constructor(private authService: AuthService) {
    this.connect();
  }

  private connect() {
    this.authService.user$.subscribe({
      next: (user) => {
        if (user) {
          let ws = new SockJS(this.serverUrl);
          this.stompClient = Stomp.Stomp.over(ws);
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
      (message: { body: Notification }) => {
        this.handleResult(message);
      }
    );
  }
  handleResult(message: { body: Notification }) {
    if (message.body) {
      console.log(message.body);
      this.notificationsSubject.next(message.body);
    }
  }
}
