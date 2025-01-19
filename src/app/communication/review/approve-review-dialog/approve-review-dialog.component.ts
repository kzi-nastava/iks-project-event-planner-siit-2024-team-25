import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-approve-review-dialog',
  templateUrl: './approve-review-dialog.component.html',
  styleUrl: './approve-review-dialog.component.scss',
})
export class ApproveReviewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: { reviewId: number }
  ) {}

  onCancel() {
    this.dialogRef.close();
  }
  onApprove() {
    this.dialogRef.close(true);
  }
}
