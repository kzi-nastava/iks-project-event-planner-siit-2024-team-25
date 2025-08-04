import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../infrastructure/auth/guard/auth.guard';
import { roleGuard } from '../infrastructure/auth/guard/role.guard';
import { unauthenticatedGuard } from '../infrastructure/auth/guard/unauthenticated.guard';
import { UserRole } from '../infrastructure/auth/model/user-role.model';
import { ActivateComponent } from './activate/activate.component';
import { AllBlockedUsersComponent } from './all-blocked-users/all-blocked-users.component';
import { AllReportedUsersComponent } from './all-reported-users/all-reported-users.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { PublicProfileComponent } from './public-profile/public-profile.component';
import { RegisterQuickComponent } from './register-quick/register-quick.component';
import { RegisterComponent } from './register/register.component';
import { SuspensionPageComponent } from './suspension-page/suspension-page.component';
import { FavouriteOfferingsComponent } from '../offering/favourite-offerings/favourite-offerings.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [unauthenticatedGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  { path: 'activate', component: ActivateComponent },
  { path: 'register/quick', component: RegisterQuickComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
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
  {
    path: ':id',
    component: PublicProfileComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class UserRoutingModule {}
