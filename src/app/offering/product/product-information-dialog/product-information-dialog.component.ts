import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-product-dialog-information',
  templateUrl: './product-information-dialog.component.html',
  styleUrl: './product-information-dialog.component.scss',
})
export class ProductDialogInformationComponent {
  constructor(
    public dialogRef: MatDialogRef<ProductDialogInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
