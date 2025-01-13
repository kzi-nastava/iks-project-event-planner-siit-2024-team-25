import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatRoom } from '../model/chat-room';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { ChatRoomService } from '../services/chat-room.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss'
})
export class ChatRoomComponent implements OnInit{
  chatList :ChatRoom[] = []
  senderId: number = -1;
  isLoading: boolean = false;
  currentPage: number = 0;
  totalPages: number = 0;
  totalChats: number = 0;
  @Output() chatSelected = new EventEmitter<{receiverId:number, receiverName:string}>(); 

  constructor(private authService: AuthService, private chatRoomService:ChatRoomService){
    this.senderId = this.authService.getUser()?.userId || -1;
  }

  ngOnInit(): void {
    this.getAllChats();
  }

  getAllChats(){
    if (this.isLoading) return;
    this.isLoading = true;
    this.chatRoomService.getChatRooms(this.senderId,this.currentPage).subscribe({
      next: (res) =>{
        this.chatList = res.chatRooms;
        this.totalPages = res.totalPages;
        this.totalChats = res.totalChats;
        this.isLoading = false;
      },
      error:(_)=>{
        console.log("error")
        this.isLoading=false;
      }
    })
  }
  scrollDown() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getAllChats();

    }
  }
  scrollUp() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getAllChats();

    }

  }
  onChatSelected(chat: { receiverId: number, receiverName: string }) {
    this.chatSelected.emit(chat)
  }

}
