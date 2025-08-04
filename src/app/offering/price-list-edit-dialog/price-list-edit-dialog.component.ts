import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-price-list-edit-dialog',
  templateUrl: './price-list-edit-dialog.component.html',
  styleUrl: './price-list-edit-dialog.component.scss'
})
export class PriceListEditDialogComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PriceListEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { price: number; discount: number }
  ) {
    this.editForm = this.fb.group({
      price: [data.price, [Validators.required, Validators.min(1)]],
      discount: [data.discount, [Validators.required, Validators.min(1), Validators.max(100)]],
      priceWithDiscount: [{ value: this.calculatePriceWithDiscount(data.price, data.discount), disabled: true }],
    });
    this.editForm.valueChanges.subscribe(values => {
      const { price, discount } = values;
      if (price > 0 && discount >= 1 && discount <= 100) {
        this.editForm.patchValue(
          {
            priceWithDiscount: this.calculatePriceWithDiscount(price, discount),
          },
          { emitEvent: false }
        );
      }
    });
  }

  
  private calculatePriceWithDiscount(price: number, discount: number): number {
    return price - (price * discount) / 100;
  }

  save(): void {
    if (this.editForm.valid) {
      this.dialogRef.close(this.editForm.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
