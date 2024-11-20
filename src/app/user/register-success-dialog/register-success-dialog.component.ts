import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-register-success-dialog',
  template: `
    <div class="dialog-content">
      <h2 mat-dialog-title>Registration Successful!</h2>
      <mat-dialog-content>
        <p>Please check your email to verify your account.</p>
      </mat-dialog-content>
      <mat-dialog-actions align="center">
        <button mat-button mat-dialog-close routerLink="/" class="secondary">
          Go to Home
        </button>
        <button
          mat-flat-button
          mat-dialog-close
          routerLink="/user/login"
          class="primary"
        >
          Login
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: `
    .dialog-content {
      text-align: center;

      h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }

      p {
        margin-bottom: 1.5rem;
        font-size: 1rem;
        color: #616161;
      }

      button {
        margin: 0 0.5rem;
      }
    }
  `,
})
export class RegisterSuccessDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { email: string }) {}
}
