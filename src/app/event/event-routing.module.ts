import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventTypeComponent } from './event-type/event-type.component';
import { EventTypeListComponent } from './event-type-list/event-type-list.component';

const routes: Routes = [
  { path: 'types', component: EventTypeListComponent },
  { path: 'type', component: EventTypeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class EventRoutingModule {}
