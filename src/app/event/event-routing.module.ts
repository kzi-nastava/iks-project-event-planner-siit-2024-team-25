import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleGuard } from '../infrastructure/auth/guard/role.guard';
import { UserRole } from '../infrastructure/auth/model/user-role.model';
import { EventFormComponent } from './event-form/event-form.component';
import { EventTypeListComponent } from './event-type-list/event-type-list.component';

import { EventTypeComponent } from './event-type/event-type.component';

const routes: Routes = [
  {
    path: '',
    component: EventFormComponent,
    canActivate: [roleGuard],
    data: { roles: [UserRole.EventOrganizer] },
  },
  {
    path: 'types',
    component: EventTypeListComponent,
    canActivate: [roleGuard],
    data: { roles: [UserRole.Admin] },
  },
  {
    path: 'type',
    component: EventTypeComponent,
    canActivate: [roleGuard],
    data: { roles: [UserRole.Admin] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class EventRoutingModule {}
