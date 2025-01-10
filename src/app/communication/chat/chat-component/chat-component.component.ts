import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-component',
  templateUrl: './chat-component.component.html',
  styleUrl: './chat-component.component.scss'
})
export class ChatComponentComponent implements OnInit {

  senderId: number = -1;
  message: String = "";

  constructor(private chatService: ChatService){

  }
  ngOnInit(): void {
    
  }

  sendMessage(){
    if(this.message.length > 0){
      this.chatService.sendMessage({chatId: "", senderId: 1, receiverId:2, content:this.message})
    }
  }

}
