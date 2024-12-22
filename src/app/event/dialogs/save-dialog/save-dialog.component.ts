import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OfferingCategoryService } from '../../../offering/offering-category/offering-category.service';
import { OfferingCategory } from '../../model/offering-category.model';
import { EventTypeService } from '../../service/event-type.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BudgetPlanService } from '../../service/budget-plan.service';

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrl: './save-dialog.component.scss'
})
export class SaveDialogComponent implements OnInit{


  budgetForm = new FormGroup({
    budget : new FormControl(0, [Validators.required, Validators.min(1)])
  })

  isSelecetedOfferingCategorySuitable = true
  selectedOfferingCategoryOptionId : number = -1
  offeringCategoryOption: OfferingCategory[] = []

    constructor(public dialogRef: MatDialogRef<any>,
      @Inject(MAT_DIALOG_DATA) public data: { budget:any, eventTypeId: number, isEdit: boolean, eventId: number }, 
      private budgetPlanService:BudgetPlanService, private eventTypeService: EventTypeService
    ) {}
    
  ngOnInit(): void {
    this.getAllOption();
    this.budgetForm.patchValue({
      budget: this.data.budget
    })
    
  }

  getAllOption(){
    this.eventTypeService.getCategoriesByEventType(this.data.eventTypeId).subscribe({
      next:(res)=>{
        console.log(res)
        this.offeringCategoryOption = res
      },
      error:(_)=>{
        console.log("error")
      }
    })
  }

  onApprove(){
    if(this.budgetForm.valid){
      if(this.data.isEdit){
          this.dialogRef.close({budget:this.budgetForm.value.budget})
      }else{
        if(this.selectedOfferingCategoryOptionId!=-1){
          this.budgetPlanService.isOfferingCategorySuitableForEvent(this.data.eventId, this.selectedOfferingCategoryOptionId).subscribe({
            next:(res)=>{
              if(res){
                this.isSelecetedOfferingCategorySuitable = true
                this.dialogRef.close({budget:this.budgetForm.value.budget, offerId:this.selectedOfferingCategoryOptionId})
              }else{
                this.isSelecetedOfferingCategorySuitable = false
              }
            }
          })
        }
      }
      
      
    }
    console.log(this.selectedOfferingCategoryOptionId)
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  refreshError() {
    this.isSelecetedOfferingCategorySuitable = true
    }
}
