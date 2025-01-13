import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.scss'
})
export class ChatViewComponent {

   selectedChat : any;

   onChatSelected(chat: { receiverId: number, receiverName: string }) {
    this.selectedChat = null;  
    setTimeout(() => {
      this.selectedChat = chat;  
    }, 1);
  }
}
