import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.scss',
})
export class ProductDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: { productName: string; productId: number },
  ) {}

  onYesClick(): void {
    this.dialogRef.close({
      response: 'yes',
      productName: this.data.productName,
      productId: this.data.productId,
    });
  }

  onNoClick(): void {
    this.dialogRef.close('no');
  }
}
