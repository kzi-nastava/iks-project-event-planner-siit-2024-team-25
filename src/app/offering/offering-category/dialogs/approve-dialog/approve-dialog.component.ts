import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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

  nameCategory = new FormControl("", [Validators.required, Validators.minLength(3)])

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
        this.selectedOfferingCategoryOptionId = offers[0].id
      },
      error: (_) => {
        console.log("error")
      }
    })
  }

  onApprove(): void {
    if(this.data.submittedOffer.name){
      if(this.disableSelect){
        this.offeringCategoryService.getById(this.selectedOfferingCategoryOptionId).subscribe({
          next: (value: OfferingCategory)=>{
            this.dialogRef.close(value)
          },
          error: (_)=>{
            console.log("error")
          }
        })
      }else{
        this.dialogRef.close(this.data.submittedOffer);
      }
    }else{
      return;
    }
    
    
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
