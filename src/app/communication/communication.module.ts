import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { ChatComponentComponent } from './chat/chat-component/chat-component.component';
import { CommunicationRoutingModule } from './communication-routing.module';
import { AllReviewsComponent } from './review/all-reviews/all-reviews.component';
import { ApproveReviewDialogComponent } from './review/approve-review-dialog/approve-review-dialog.component';

@NgModule({
  declarations: [
    NotificationComponent,
    ChatComponentComponent,
    AllReviewsComponent,
    ApproveReviewDialogComponent,
  ],
  imports: [CommonModule, MaterialModule, CommunicationRoutingModule],
})
export class CommunicationModule {}
