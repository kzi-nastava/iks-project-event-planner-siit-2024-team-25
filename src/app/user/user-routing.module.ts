import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { unauthenticatedGuard } from '../infrastructure/auth/guard/unauthenticated.guard';
import { ActivateComponent } from './activate/activate.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterQuickComponent } from './register-quick/register-quick.component';
import { AllReportedUsersComponent } from './all-reported-users/all-reported-users.component';
import { UserRole } from '../infrastructure/auth/model/user-role.model';
import { roleGuard } from '../infrastructure/auth/guard/role.guard';
import { AllBlockedUsersComponent } from './all-blocked-users/all-blocked-users.component';
import { SuspensionPageComponent } from './suspension-page/suspension-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [unauthenticatedGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [unauthenticatedGuard],
  },
  { path: 'activate', component: ActivateComponent },
  { path: 'register/quick', component: RegisterQuickComponent },
  {
    path: 'reports',
    component: AllReportedUsersComponent,
    canActivate: [roleGuard],
    data: { roles: [UserRole.Admin] },
  },
  {
    path: 'blocks',
    component: AllBlockedUsersComponent,
    canActivate: [roleGuard],
    data: { roles: [UserRole.Admin] },
  },
  {
    path: 'suspension',
    component: SuspensionPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class UserRoutingModule {}
