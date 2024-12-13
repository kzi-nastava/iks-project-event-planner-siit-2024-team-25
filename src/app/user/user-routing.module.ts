import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { unauthenticatedGuard } from '../infrastructure/auth/guard/unauthenticated.guard';
import { ActivateComponent } from './activate/activate.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterQuickComponent } from './register-quick/register-quick.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class UserRoutingModule {}
