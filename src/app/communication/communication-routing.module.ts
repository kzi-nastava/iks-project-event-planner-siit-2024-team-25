import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponentComponent } from './chat/chat-component/chat-component.component';

const routes: Routes = [
  { path: '', component: ChatComponentComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationRoutingModule { }
