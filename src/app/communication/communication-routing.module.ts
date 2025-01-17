import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponentComponent } from './chat/chat-component/chat-component.component';
import { ChatRoomComponent } from './chat/chat-room/chat-room.component';
import { ChatViewComponent } from './chat/chat-view/chat-view.component';
import { ReviewMakeComponent } from './review/review-make/review-make.component';
import { ReviewListComponent } from './review/review-list/review-list.component';

const routes: Routes = [
  { path: ':userId/:userName', component: ChatComponentComponent },
  {path : '', component: ChatViewComponent},
  {path: 'review', component: ReviewMakeComponent},
  {path: 'review-list', component: ReviewListComponent},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationRoutingModule { }
