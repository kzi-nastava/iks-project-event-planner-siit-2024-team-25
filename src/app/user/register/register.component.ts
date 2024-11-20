import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { confirmPasswordValidator } from '../../infrastructure/validators/confirmPasswordValidator';
import { RegisterSuccessDialogComponent } from '../register-success-dialog/register-success-dialog.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  selectedRole: 'organizer' | 'owner' = 'organizer';
  form!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  profilePicture: File | null = null;
  companyPictures: File[] = [];
  waitingResponse = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        profilePicture: [null],

        // Role Specific Fields
        eventOrganizerFields: this.fb.group({
          country: ['', [this.requiredForRole('organizer')]],
          city: ['', [this.requiredForRole('organizer')]],
          address: ['', [this.requiredForRole('organizer')]],
          phoneNumber: [null, [this.requiredForRole('organizer')]],
        }),

        ownerFields: this.fb.group({
          companyName: ['', [this.requiredForRole('owner')]],
          country: ['', [this.requiredForRole('owner')]],
          city: ['', [this.requiredForRole('owner')]],
          address: ['', [this.requiredForRole('owner')]],
          contactPhone: ['', [this.requiredForRole('owner')]],
          description: [''],
          companyPictures: [null],
        }),
      },
      {
        validators: [confirmPasswordValidator('password', 'confirmPassword')],
      },
    );
  }

  private requiredForRole(role: 'organizer' | 'owner'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const isValid = this.selectedRole !== role || value;

      return isValid ? null : { required: true };
    };
  }

  onProfilePictureSelected(files: File[]) {
    this.profilePicture = files[0] || null;
    this.form.patchValue({
      profilePicture: this.profilePicture,
    });
  }

  onCompanyPicturesSelected(files: File[]) {
    this.companyPictures = Array.from(files);
    this.form.get('ownerFields')?.patchValue({
      companyPictures: this.companyPictures,
    });
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const email = this.form.get('email')?.value;
      console.log(email);
      this.form.reset();
      this.dialog.open(RegisterSuccessDialogComponent, {
        width: '400px',
        data: { email },
      });
    }
  }
}
