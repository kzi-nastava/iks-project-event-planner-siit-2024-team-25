import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxMatInputTelComponent } from 'ngx-mat-input-tel';
import { EventModule } from '../event/event.module';

import { AuthModule } from '../infrastructure/auth/auth.module';
import { MaterialModule } from '../infrastructure/material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ActivateComponent } from './activate/activate.component';
import { AllBlockedUsersComponent } from './all-blocked-users/all-blocked-users.component';
import { AllReportedUsersComponent } from './all-reported-users/all-reported-users.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DeactivateConfirmDialogComponent } from './deactivate-confirm-dialog/deactivate-confirm-dialog.component';
import { SuspendUserDialogComponent } from './dialogs/suspend-user-dialog/suspend-user-dialog.component';
import { EditCompanyInfoComponent } from './edit-company-info/edit-company-info.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { LoginComponent } from './login/login.component';
import { PasswordResetDialogComponent } from './password-reset-dialog/password-reset-dialog.component';
import { ProfileComponent } from './profile/profile.component';
import { PublicProfileComponent } from './public-profile/public-profile.component';
import { RegisterQuickComponent } from './register-quick/register-quick.component';
import { RegisterSuccessDialogComponent } from './register-success-dialog/register-success-dialog.component';
import { RegisterComponent } from './register/register.component';
import { ReportUserComponent } from './report-user/report-user.component';
import { SuspensionPageComponent } from './suspension-page/suspension-page.component';
import { UpdateProfilePictureComponent } from './update-profile-picture/update-profile-picture.component';
import { UserRoutingModule } from './user-routing.module';
import { OfferingModule } from '../offering/offering.module';

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
    SuspensionPageComponent,
    ReportUserComponent,
    ProfileComponent,
    EditProfileComponent,
    UpdateProfilePictureComponent,
    EditCompanyInfoComponent,
    PasswordResetDialogComponent,
    DeactivateConfirmDialogComponent,
    CalendarComponent,
    PublicProfileComponent,
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
    EventModule,
    FullCalendarModule,
    OfferingModule
  ],
})
export class UserModule {}
