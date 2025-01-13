import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import { environment } from '../../../../environment/environment';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChatMessage } from '../model/chat-message';
import { Page } from '../../../shared/model/page.mode';

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
    this.stompClient.subscribe(`/chat/user/${userId}`, (message :{ body: string }) => {
      console.log(message)
      const msgBody = JSON.parse(message.body);
      this.addMessage(msgBody.content);
    });
  }
  getIncomingMessages(): Observable<any> {
    return this.messageSubject.asObservable();  
  }

  sendMessage(chatMessage: {senderId: number, receiverId: number, content: string }): Observable<any> {
    return new Observable(observer => {
      /*this.stompClient.subscribe('/user/' + chatMessage.receiverId +'/queue/messages', (message: any) => {
        const messageBody = JSON.parse(message.body);
        this.addMessage(messageBody)
        observer.next(messageBody);
        observer.complete();
        
      
      });*/
      this.stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
      observer.next(true);
      observer.complete();
    });
  }
  
  
  private addMessage(message: string) {
    const currentMessages = this.messageSubject.value;
    this.messageSubject.next([...currentMessages, message]);
    console.log(currentMessages)
  }

  getChatMessages(senderId:number, receiverId:number, page: number) : Observable<
  
  {
      currentMessages: ChatMessage[];
      totalMessages: number;
      totalPages: number;
    }>{
          let params = new HttpParams();
          params = params.set('page', page);
          params = params.set('size', 7);
    return this.httpClient.get<Page<ChatMessage>>(environment.apiHost + `/api/messages/${senderId}/${receiverId}`, {params:params})
    .pipe(
            map((page) => ({
              currentMessages: page.content,
              totalMessages: page.totalElements,
              totalPages: page.totalPages,
            }))
          );
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}
