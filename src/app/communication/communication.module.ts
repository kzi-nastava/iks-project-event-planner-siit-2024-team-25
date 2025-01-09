import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { ChatComponentComponent } from './chat/chat-component/chat-component.component';

@NgModule({
  declarations: [NotificationComponent, ChatComponentComponent],
  imports: [CommonModule, MaterialModule],
})
export class CommunicationModule {}
