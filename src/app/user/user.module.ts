import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatInputTelComponent } from 'ngx-mat-input-tel';

import { AuthModule } from '../infrastructure/auth/auth.module';
import { MaterialModule } from '../infrastructure/material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ActivateComponent } from './activate/activate.component';
import { LoginComponent } from './login/login.component';
import { RegisterSuccessDialogComponent } from './register-success-dialog/register-success-dialog.component';
import { RegisterComponent } from './register/register.component';
import { UserRoutingModule } from './user-routing.module';
import { RegisterQuickComponent } from './register-quick/register-quick.component';
import { AllReportedUsersComponent } from './all-reported-users/all-reported-users.component';
import { AllBlockedUsersComponent } from './all-blocked-users/all-blocked-users.component';
import { SuspendUserDialogComponent } from './dialogs/suspend-user-dialog/suspend-user-dialog.component';
import { DeleteReportDialogComponent } from './dialogs/delete-report-dialog/delete-report-dialog.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RegisterSuccessDialogComponent,
    ActivateComponent,
    RegisterQuickComponent,
    AllReportedUsersComponent,
    AllBlockedUsersComponent,
    SuspendUserDialogComponent,
    DeleteReportDialogComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule,
    NgxMatInputTelComponent,
    SharedModule,
  ],
})
export class UserModule {}
