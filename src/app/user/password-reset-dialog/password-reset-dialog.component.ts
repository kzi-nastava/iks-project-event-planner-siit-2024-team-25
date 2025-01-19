import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { confirmPasswordValidator } from '../../infrastructure/validators/confirmPasswordValidator';
import { passwordValidator } from '../../infrastructure/validators/passwordValidator';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { AccountService } from '../service/account.service';

@Component({
  selector: 'app-password-reset-dialog',
  templateUrl: './password-reset-dialog.component.html',
  styleUrls: ['./password-reset-dialog.component.scss'],
})
export class PasswordResetDialogComponent implements OnInit {
  form!: FormGroup;
  hideOldPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  waitingResponse = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PasswordResetDialogComponent>,
    private accountService: AccountService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, passwordValidator()]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [
          confirmPasswordValidator('newPassword', 'confirmPassword'),
        ],
      },
    );
  }

  get oldPassword() {
    return this.form.get('oldPassword');
  }

  get newPassword() {
    return this.form.get('newPassword');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.waitingResponse = true;

      this.accountService
        .resetPassword(this.form.value.oldPassword, this.form.value.newPassword)
        .subscribe({
          next: () => {
            this.toastr.success('Password changed successfully!');
            this.dialogRef.close(true);
          },
          error: (error: ErrorResponse) => {
            this.waitingResponse = false;
            this.toastr.error(error.message, 'Failed to reset password!');
          },
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  togglePasswordVisibility(field: string): void {
    switch (field) {
      case 'old':
        this.hideOldPassword = !this.hideOldPassword;
        break;
      case 'new':
        this.hideNewPassword = !this.hideNewPassword;
        break;
      case 'confirm':
        this.hideConfirmPassword = !this.hideConfirmPassword;
        break;
    }
  }
}
