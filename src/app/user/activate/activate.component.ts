import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ErrorResponse } from '../../shared/model/error.response.model';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.scss',
})
export class ActivateComponent implements OnInit {
  verificationStatus: 'loading' | 'success' | 'error' = 'loading';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      if (code) {
        this.verifyAccount(code);
      } else {
        this.verificationStatus = 'error';
        this.errorMessage = 'No verification code provided.';
      }
    });
  }

  verifyAccount(activationCode: string): void {
    this.verificationStatus = 'loading';

    this.userService.activateAccount(activationCode).subscribe({
      next: () => {
        this.verificationStatus = 'success';
      },
      error: (error: ErrorResponse) => {
        this.verificationStatus = 'error';
        this.errorMessage = error.message || 'Account activation failed.';
      },
    });
  }
}
