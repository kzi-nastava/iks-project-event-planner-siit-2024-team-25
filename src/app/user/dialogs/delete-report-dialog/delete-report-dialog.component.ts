import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-report-dialog',
  templateUrl: './delete-report-dialog.component.html',
  styleUrl: './delete-report-dialog.component.scss',
})
export class DeleteReportDialogComponent {
  constructor(public dialogRef: MatDialogRef<any>) {}

  onCancel() {
    this.dialogRef.close();
  }
  onDelete() {
    this.dialogRef.close(true);
  }
}
