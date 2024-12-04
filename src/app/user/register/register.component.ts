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
import { ToastrService } from 'ngx-toastr';

import { confirmPasswordValidator } from '../../infrastructure/validators/confirmPasswordValidator';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { RegisterRequest } from '../model/register.request.model';
import { RegisterResponse } from '../model/register.response.model';
import { RegisterSuccessDialogComponent } from '../register-success-dialog/register-success-dialog.component';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  selectedRole: 'EVENT_ORGANIZER' | 'OWNER' = 'EVENT_ORGANIZER';
  form!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  profilePicture: File | null = null;
  companyPictures: File[] = [];
  waitingResponse = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private userService: UserService,
    private toastService: ToastrService,
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
          country: ['', [this.requiredForRole('EVENT_ORGANIZER')]],
          city: ['', [this.requiredForRole('EVENT_ORGANIZER')]],
          address: ['', [this.requiredForRole('EVENT_ORGANIZER')]],
          phoneNumber: [null, [this.requiredForRole('EVENT_ORGANIZER')]],
        }),

        ownerFields: this.fb.group({
          companyName: ['', [this.requiredForRole('OWNER')]],
          country: ['', [this.requiredForRole('OWNER')]],
          city: ['', [this.requiredForRole('OWNER')]],
          address: ['', [this.requiredForRole('OWNER')]],
          contactPhone: ['', [this.requiredForRole('OWNER')]],
          description: [''],
          companyPictures: [null],
        }),
      },
      {
        validators: [confirmPasswordValidator('password', 'confirmPassword')],
      },
    );
  }

  private requiredForRole(role: 'EVENT_ORGANIZER' | 'OWNER'): ValidatorFn {
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
      this.waitingResponse = true;

      const formValues = this.form.value;

      const registerRequest: RegisterRequest = {
        email: formValues.email,
        password: formValues.password,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        profilePicture: this.profilePicture,
        userRole: this.selectedRole,
        ...(this.selectedRole === 'OWNER' && {
          ownerFields: {
            companyName: formValues.ownerFields.companyName,
            companyAddress: {
              country: formValues.ownerFields.country,
              city: formValues.ownerFields.city,
              address: formValues.ownerFields.address,
            },
            contactPhone: formValues.ownerFields.contactPhone,
            description: formValues.ownerFields.description,
            companyPictures: this.companyPictures,
          },
        }),
        ...(this.selectedRole === 'EVENT_ORGANIZER' && {
          eventOrganizerFields: {
            livingAddress: {
              country: formValues.eventOrganizerFields.country,
              city: formValues.eventOrganizerFields.city,
              address: formValues.eventOrganizerFields.address,
            },
            phoneNumber: formValues.eventOrganizerFields.phoneNumber,
          },
        }),
      };

      this.userService.register(registerRequest).subscribe({
        next: (registerResponse: RegisterResponse) => {
          this.waitingResponse = false;
          this.form.reset();
          this.dialog.open(RegisterSuccessDialogComponent, {
            width: '480px',
            data: registerResponse,
          });
        },
        error: (error: ErrorResponse) => {
          this.waitingResponse = false;
          this.toastService.error(error.message, 'Failed to register');

          console.log(error);

          if (error.errors) {
            Object.keys(error.errors).forEach((fieldName) => {
              const control = this.form.get(fieldName);
              if (control) {
                control.setErrors({ serverError: error.errors[fieldName] });
              }
            });
          }
        },
      });
    }
  }
}
