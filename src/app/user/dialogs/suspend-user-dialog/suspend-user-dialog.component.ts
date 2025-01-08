import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-suspend-user-dialog',
  templateUrl: './suspend-user-dialog.component.html',
  styleUrl: './suspend-user-dialog.component.scss',
})
export class SuspendUserDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: { userName: String }
  ) {}

  onCancel() {
    this.dialogRef.close();
  }
  onDelete() {
    this.dialogRef.close(true);
  }
}
