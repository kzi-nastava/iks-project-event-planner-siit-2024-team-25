import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { ChatComponentComponent } from './chat/chat-component/chat-component.component';
import { CommunicationRoutingModule } from './communication-routing.module';
import { ChatRoomComponent } from './chat/chat-room/chat-room.component';
import { ChatViewComponent } from './chat/chat-view/chat-view.component';
import { ChatCardComponent } from './chat/chat-card/chat-card.component';

@NgModule({
  declarations: [NotificationComponent, ChatComponentComponent, ChatRoomComponent, ChatViewComponent, ChatCardComponent],
  imports: [CommonModule, MaterialModule, CommunicationRoutingModule],
})
export class CommunicationModule {}
