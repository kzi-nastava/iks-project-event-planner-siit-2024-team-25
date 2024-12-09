import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OfferingCategory } from '../../model/offering-category';
import { OfferingCategoryType } from '../../model/offering-category-type.enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OfferingCategoryService } from '../../offering-category.service';

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrl: './create-dialog.component.scss'
})
export class CreateDialogComponent {

  offeringForm = new FormGroup({
    name: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required)
  })

  constructor(public dialogRef: MatDialogRef<any>, private offeringCategoryService: OfferingCategoryService
  ) {}

  onApprove() {
    if(this.offeringForm.valid){
      const tempData = this.offeringForm.value

      let offeringData:OfferingCategory = {
        id: -1,
        name: tempData.name || "",
        description: tempData.description || "",
        status: OfferingCategoryType.ACCEPTED
      }
      this.offeringCategoryService.createOfferingCategory(offeringData).subscribe({
        next:()=>{
          this.dialogRef.close(true)
        },
        error:(_)=>{
          console.log("error")
        }
      })
    }
  }
  onCancel() {
    this.dialogRef.close()
  }

}
