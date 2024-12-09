import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EventService } from '../service/event.service';
import { EventInvitation } from '../model/event.invitation.model';

@Component({
  selector: 'app-event-invitations',
  templateUrl: './event-invitations.component.html',
  styleUrl: './event-invitations.component.scss',
})
export class EventInvitationsComponent {
  emailForm: FormGroup;
  emails: string[] = [];
  invitations: EventInvitation[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EventInvitationsComponent>,
    private eventService: EventService
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  addEmail(): void {
    const email = this.emailForm.get('email')?.value;
    if (email) {
      this.emails.push(email);
      this.invitations.push({ guestEmail: email });
      this.emailForm.reset();
    }
  }

  submitEmails(): void {
    //TO DO get eventId from URL
    this.eventService.sendInvitations(this.invitations, 4);
    this.dialogRef.close(this.emails);
  }
}
