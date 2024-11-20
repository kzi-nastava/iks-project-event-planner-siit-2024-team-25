import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatInputTelComponent } from 'ngx-mat-input-tel';

import { AuthModule } from '../infrastructure/auth/auth.module';
import { MaterialModule } from '../infrastructure/material/material.module';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { RegisterSuccessDialogComponent } from './register-success-dialog/register-success-dialog.component';
import { RegisterComponent } from './register/register.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RegisterSuccessDialogComponent,
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
