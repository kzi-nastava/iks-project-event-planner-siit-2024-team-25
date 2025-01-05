import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventInvitation } from '../../event/model/event.invitation.model';
import { EventInvitationsComponent } from '../../event/event-invitations/event-invitations.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventService } from '../../event/service/event.service';
import { ReportUserService } from '../service/report-user.service';
import { ReportUserRequest } from '../model/report.user.request.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-report-user',
  templateUrl: './report-user.component.html',
  styleUrl: './report-user.component.scss',
})
export class ReportUserComponent {
  reportForm: FormGroup;
  reportedUserId: number = -1;

  constructor(
    private fb: FormBuilder,
    private reportUserService: ReportUserService,
    @Inject(MAT_DIALOG_DATA) public data: { reportedUserId: number },
    private dialogRef: MatDialogRef<ReportUserComponent>,
    private toastrService: ToastrService
  ) {
    this.reportedUserId = data.reportedUserId;
    this.reportForm = this.fb.group({
      message: ['', [Validators.required]],
    });
  }

  sendReport(): void {
    const message = this.reportForm.get('message')?.value;
    if (message) {
      const request: ReportUserRequest = {
        reportMessage: message,
        reportedUserId: this.reportedUserId,
      };
      this.reportUserService.reportUser(request).subscribe({
        next: (response: void) => {
          this.toastrService.success(
            'You successfully report user.',
            'Success'
          );
          this.dialogRef.close();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    }
  }
}
