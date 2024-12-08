import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OfferingCategory } from '../../model/offering-category';
import { OfferingCategoryService } from '../../offering-category.service';

@Component({
  selector: 'app-approve-dialog',
  templateUrl: './approve-dialog.component.html',
  styleUrl: './approve-dialog.component.scss'
})
export class ApproveDialogComponent implements OnInit {

  disableSelect = false
  selectedOfferingCategoryOptionId : number = -1
  offeringCategoryOption: OfferingCategory[] = []

  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: { submittedOffer:any }, private offeringCategoryService:OfferingCategoryService
  ) {}
  ngOnInit(): void {
    this.getAllOptions()
  }

  getAllOptions(){
    this.offeringCategoryService.getAll().subscribe({
      next:(offers:OfferingCategory[])=>{
        this.offeringCategoryOption = offers
      },
      error: (_) => {
        console.log("error")
      }
    })
  }

  onApprove(): void {
    if(this.disableSelect){
      this.offeringCategoryService.getById(this.selectedOfferingCategoryOptionId).subscribe({
        next: (value: OfferingCategory)=>{
          console.log(value, "chose")
          this.dialogRef.close(value)
        },
        error: (_)=>{
          console.log("error")
        }
      })
    }else{
      this.dialogRef.close(this.data.submittedOffer);
    }
    
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
