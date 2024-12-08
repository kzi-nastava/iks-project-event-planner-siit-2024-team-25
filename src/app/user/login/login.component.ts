import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  hidePassword = true;
  waitingResponse = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  async onSubmit() {
    if (this.form.valid) {
      this.waitingResponse = true;
      this.loginService
        .login(this.email?.value, this.password?.value)
        .pipe(finalize(() => (this.waitingResponse = false)))
        .subscribe({
          next: () => {
            this.toastr.success("You've successfully logged in!", 'Success');
            this.router.navigate(['/']);
          },
          error: (err: ErrorResponse) => {
            this.toastr.error(err.message, 'Oops!');
          },
        });
    }
  }
}
