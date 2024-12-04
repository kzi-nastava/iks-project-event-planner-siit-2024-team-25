import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RegisterResponse } from '../model/register.response.model';

@Component({
  selector: 'app-register-success-dialog',
  template: `
    <div class="dialog-wrapper">
      <div class="dialog-content">
        <mat-icon class="success-icon">check_circle</mat-icon>
        <h2 mat-dialog-title>Registration Successful!</h2>
        <mat-dialog-content>
          <p class="verification-message">
            Welcome aboard, {{ data.fullName }}! Please check your email at
            <strong>{{ data.email }}</strong> to verify your account.
          </p>
        </mat-dialog-content>
        <mat-dialog-actions>
          <button
            mat-stroked-button
            mat-dialog-close
            routerLink="/"
            color="primary"
            class="action-button"
          >
            Go to Home
          </button>
          <button
            mat-flat-button
            mat-dialog-close
            routerLink="/user/login"
            color="primary"
            class="action-button"
          >
            Login
          </button>
        </mat-dialog-actions>
      </div>
    </div>
  `,
  styleUrl: './register-success-dialog.component.scss',
})
export class RegisterSuccessDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: RegisterResponse) {}
}
