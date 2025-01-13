import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss'
})
export class ChatRoomComponent {
  chatList = [
    { name: 'John Doe', lastMessage: 'Hey there!', avatar: 'https://via.placeholder.com/50' },
    { name: 'Jane Smith', lastMessage: 'Meeting at 5 PM?', avatar: 'https://via.placeholder.com/50' },
    { name: 'Michael Brown', lastMessage: 'Let’s catch up later!', avatar: 'https://via.placeholder.com/50' }
  ];
}
