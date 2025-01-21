import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponentComponent } from './chat/chat-component/chat-component.component';
import { AllReviewsComponent } from './review/all-reviews/all-reviews.component';
import { roleGuard } from '../infrastructure/auth/guard/role.guard';
import { UserRole } from '../infrastructure/auth/model/user-role.model';
import { ChatRoomComponent } from './chat/chat-room/chat-room.component';
import { ChatViewComponent } from './chat/chat-view/chat-view.component';
import { ReviewMakeComponent } from './review/review-make/review-make.component';
import { ReviewListComponent } from './review/review-list/review-list.component';
import { EventOfferingReviewListComponent } from './review/event-offering-review-list/event-offering-review-list.component';

const routes: Routes = [
  { path: ':userId/:userName', component: ChatComponentComponent },

  {path : '', component: ChatViewComponent},
  {path: 'review', component: ReviewMakeComponent},
  {path: 'review-list', component: ReviewListComponent},

  {
    path: 'reviews',
    component: AllReviewsComponent,
    canActivate: [roleGuard],
    data: { roles: [UserRole.Admin] },
  },
  { path: '', component: ChatViewComponent },
  {path: 'offering-event',component:EventOfferingReviewListComponent},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationRoutingModule {}
