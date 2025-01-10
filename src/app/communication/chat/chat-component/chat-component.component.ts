import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-chat-component',
  templateUrl: './chat-component.component.html',
  styleUrl: './chat-component.component.scss'
})
export class ChatComponentComponent implements OnInit {

  message: String = "";
  @ViewChild('chatMessages') chatMessages: ElementRef | undefined;

  constructor(private chatService: ChatService,private renderer: Renderer2){

  }
  ngOnInit(): void {
    this.getChat();
  }

  sendMessage(){
    if(this.message.length > 0){
      this.chatService.sendMessage({chatId: "", senderId: 1, receiverId:2, content:this.message})
    }
  }

  // 1 for senderId
  // 2 for receiverId
  getChat(){
    this.chatService.getChatMessages(1,2).subscribe({
      next:(res) =>{
        res.forEach(elem => {
          if(elem.sender.id == 1){
            this.addMessageDiv('sent', elem.content)
          }else{
            this.addMessageDiv('received', elem.content)
          }
        });
      },
      error:(_)=>{
        console.log("error")
      }
    })
  }

  addMessageDiv(typeMessage: string, content:string){
    const messageDiv = this.renderer.createElement('div');
      
    this.renderer.addClass(messageDiv, 'message');
    this.renderer.addClass(messageDiv, typeMessage); 
    
    const text = this.renderer.createText(content);
    this.renderer.appendChild(messageDiv, text);
    
    this.renderer.appendChild(this.chatMessages?.nativeElement, messageDiv);
  }
  clearMessages() :Observable<boolean> {
    const chatContainer = this.chatMessages?.nativeElement;
    while (chatContainer.firstChild) {
      this.renderer.removeChild(chatContainer, chatContainer.firstChild);
    }
    return of(true);
  }

}
