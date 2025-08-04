import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-deactivate-confirm-dialog',
  templateUrl: './deactivate-confirm-dialog.component.html',
  styleUrls: ['./deactivate-confirm-dialog.component.scss'],
})
export class DeactivateConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<DeactivateConfirmDialogComponent>,
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
