import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-component',
  templateUrl: './chat-component.component.html',
  styleUrl: './chat-component.component.scss'
})
export class ChatComponentComponent implements OnInit {

  constructor(private chatService: ChatService){

  }
  ngOnInit(): void {
    
  }

}
