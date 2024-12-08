import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OfferingCategoryService } from '../../offering-category.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss'
})
export class EditDialogComponent {
  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: { category:any }
  ) {}

  onEdit(): void {
    this.dialogRef.close(this.data.category);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
