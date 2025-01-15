import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatRoom } from '../model/chat-room';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.scss'
})
export class ChatCardComponent {

  @Input() chat:ChatRoom | undefined;
  @Output() chatSelected = new EventEmitter<{receiverId:number, receiverName:string}>(); 

  openChat(){
    this.chatSelected.emit({receiverId:this.chat?.receiver.id || -1, receiverName:this.chat?.receiver.firstName + " "+ this.chat?.receiver.lastName})
  }
}
