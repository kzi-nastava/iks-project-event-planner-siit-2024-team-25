import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import { environment } from '../../../../environment/environment';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: any;
  private messageSubject = new BehaviorSubject<string[]>([]);
  private serverUrl = environment.apiHost + '/socket';
  isLoaded = false;

  messages$ = this.messageSubject.asObservable();

  constructor(    private authService: AuthService,
      private httpClient: HttpClient) {
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
            that.subscribeToChat(user.userId);
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
  private subscribeToChat(userId: number) {
    this.stompClient.subscribe('/chat/user/${userId}', (message :{ body: string }) => {
      console.log(message)
      const msgBody = JSON.parse(message.body);
      this.addMessage(msgBody.content);
    });
  }

  sendMessage(chatMessage: { sender: string; content: string }) {
    this.stompClient.publish({
      destination: '/app/user',
      body: JSON.stringify(chatMessage),
    });
  }
  private addMessage(message: string) {
    const currentMessages = this.messageSubject.value;
    this.messageSubject.next([...currentMessages, message]);
  }
  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}
