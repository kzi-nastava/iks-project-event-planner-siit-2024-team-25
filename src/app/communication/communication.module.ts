import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { ChatComponentComponent } from './chat/chat-component/chat-component.component';
import { CommunicationRoutingModule } from './communication-routing.module';
import { AllReviewsComponent } from './review/all-reviews/all-reviews.component';
import { ApproveReviewDialogComponent } from './review/approve-review-dialog/approve-review-dialog.component';
import { ChatRoomComponent } from './chat/chat-room/chat-room.component';
import { ChatViewComponent } from './chat/chat-view/chat-view.component';
import { ChatCardComponent } from './chat/chat-card/chat-card.component';
import { ReviewListComponent } from './review/review-list/review-list.component';
import { ReviewMakeComponent } from './review/review-make/review-make.component';

@NgModule({

  declarations: [
    NotificationComponent,
    ChatComponentComponent,
    AllReviewsComponent,
    ApproveReviewDialogComponent,
    ChatRoomComponent,
    ChatViewComponent,
    ChatCardComponent,
    ReviewListComponent,
    ReviewMakeComponent
  ],
  imports: [CommonModule, MaterialModule, CommunicationRoutingModule],
})
export class CommunicationModule {}
