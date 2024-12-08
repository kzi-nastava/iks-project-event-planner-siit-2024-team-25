import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { confirmPasswordValidator } from '../../infrastructure/validators/confirmPasswordValidator';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { UserService } from '../service/user.service';
import { RegisterQuickRequest } from '../model/register.quick.request.model';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../service/login.service';
import { RegisterQuickResponse } from '../model/register.quick.response.model';

@Component({
  selector: 'app-register-quick',
  templateUrl: './register-quick.component.html',
  styleUrl: './register-quick.component.scss',
})
export class RegisterQuickComponent implements OnInit {
  form!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  profilePicture: File | null = null;
  waitingResponse = false;
  invitationCode: string | null = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService
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
      },
      {
        validators: [confirmPasswordValidator('password', 'confirmPassword')],
      }
    );
    this.route.queryParamMap.subscribe((params) => {
      this.invitationCode = params.get('invitationCode');
    });
  }

  onProfilePictureSelected(files: File[]) {
    this.profilePicture = files[0] || null;
    this.form.patchValue({
      profilePicture: this.profilePicture,
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

      const registerRequest: RegisterQuickRequest = {
        email: formValues.email,
        password: formValues.password,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        profilePicture: this.profilePicture,
        userRole: 'REGULAR',
        invitationCode: this.invitationCode,
      };

      this.userService.quickRegister(registerRequest).subscribe({
        next: (registerResponse: RegisterQuickResponse) => {
          this.waitingResponse = false;
          this.loginService
            .login(registerResponse.userEmail, registerResponse.password)
            .subscribe({
              next: () => {
                console.log(registerResponse.eventId);
                this.form.reset();
                this.router.navigate(['/'], {});
              },
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
