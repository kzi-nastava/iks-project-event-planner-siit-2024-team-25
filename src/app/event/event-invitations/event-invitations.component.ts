import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-event-invitations',
  templateUrl: './event-invitations.component.html',
  styleUrl: './event-invitations.component.scss',
})
export class EventInvitationsComponent {
  emailForm: FormGroup;
  emails: string[] = []; // Lista svih unetih emailova

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EventInvitationsComponent>
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Dodaje email u listu i resetuje input polje
  addEmail(): void {
    const email = this.emailForm.get('email')?.value;
    if (email) {
      this.emails.push(email);
      this.emailForm.reset();
    }
  }

  // Prosleđuje listu emailova i zatvara dijalog
  submitEmails(): void {
    this.dialogRef.close(this.emails);
  }
}
