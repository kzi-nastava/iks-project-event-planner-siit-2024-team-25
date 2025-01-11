import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { ChatComponentComponent } from './chat/chat-component/chat-component.component';
import { CommunicationRoutingModule } from './communication-routing.module';

@NgModule({
  declarations: [NotificationComponent, ChatComponentComponent],
  imports: [CommonModule, MaterialModule, CommunicationRoutingModule],
})
export class CommunicationModule {}
