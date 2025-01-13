import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { concatMapTo, Observable, of } from 'rxjs';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-component',
  templateUrl: './chat-component.component.html',
  styleUrl: './chat-component.component.scss'
})
export class ChatComponentComponent implements OnInit {

  @Input() selectedChat: any;

  message: string = "";
  @ViewChild('chatMessages') chatMessages: ElementRef | undefined;

  isLoading: boolean = false;
  currentPage: number = 0;
  totalPages: number = 0;
  totalMessages: number = 0;

  senderId: number = -1;
  receiverId: number = -1;
  receiverName: string = ""

  constructor(private chatService: ChatService, private renderer: Renderer2, private authService: AuthService,private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.receiverId = params['userId'];
      this.receiverName = params['userName'];
    });
    this.senderId = this.authService.getUser()?.userId || -1;
  }
  ngOnInit(): void {
    if(this.selectedChat){
      this.receiverId = this.selectedChat.receiverId;
      this.receiverName = this.selectedChat.receiverName;
    }
    this.getChat();
  }

  sendMessage() {
    if (this.message.length > 0) {
      this.chatService.sendMessage({ senderId: this.senderId, receiverId: this.receiverId, content: this.message })
      .subscribe({
        next: (response) => {
          
          this.getChat();
          this.currentPage = 0;
          this.message = '';
        },
        error: (err) => {
          console.error('Greška prilikom slanja poruke:', err);
        }
      });
    
    }
  }

  getChat() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.clearMessages().subscribe(() => {

      this.chatService.getChatMessages(this.senderId, this.receiverId, this.currentPage).subscribe({
        next: (res) => {
          res.currentMessages.reverse().forEach(elem => {
            if (elem.sender.id == this.senderId) {
              this.addMessageDiv('sent', elem.content, new Date(elem.timestamp))
            } else {
              this.addMessageDiv('received', elem.content, new Date(elem.timestamp))
            }
          });
          
          this.totalMessages = res.totalMessages;
          this.totalPages = res.totalPages;
          this.isLoading = false;
        },
        error: (_) => {
          console.log("error")
        }
      })
    })

  }


  scrollDown() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getChat();

    }
  }
  scrollUp() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getChat();

    }

  }

  addMessageDiv(typeMessage: string, content: string, date: Date) {
    const messageDiv = this.renderer.createElement('div');

    this.renderer.addClass(messageDiv, 'message');
    this.renderer.addClass(messageDiv, typeMessage);

    const messageContent = this.renderer.createElement('div');
    this.renderer.addClass(messageContent, 'message-content');
    const text = this.renderer.createText(content);
    this.renderer.appendChild(messageContent, text);
    this.renderer.appendChild(messageDiv, messageContent);

    const dateDiv = this.renderer.createElement('div');
    this.renderer.addClass(dateDiv, 'message-date');
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    const dateText = this.renderer.createText(formattedDate);
    this.renderer.appendChild(dateDiv, dateText);
    this.renderer.appendChild(messageDiv, dateDiv);

    this.renderer.appendChild(this.chatMessages?.nativeElement, messageDiv);
  }

  clearMessages(): Observable<boolean> {
    const chatContainer = this.chatMessages?.nativeElement;
    if (chatContainer) {
      chatContainer.innerHTML = '';  
    }
    return of(true);
  }

}
