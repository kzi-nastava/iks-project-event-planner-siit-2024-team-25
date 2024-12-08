import { Component, OnInit } from '@angular/core';
import { OfferingCategoryService } from '../offering-category.service';
import { Router } from '@angular/router';
import { OfferingCategory } from '../model/offering-category';
import { EditDialogComponent } from '../dialogs/edit-dialog/edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OfferingCategoryType } from '../model/offering-category-type.enum';
import { switchMap } from 'rxjs';
import { OfferingService } from '../../services/offering.service';
import { SubmittedOffering } from '../model/submitted-offering';
import { ApproveDialogComponent } from '../dialogs/approve-dialog/approve-dialog.component';

@Component({
  selector: 'app-offering-category-list',
  templateUrl: './offering-category-list.component.html',
  styleUrl: './offering-category-list.component.scss'
})
export class OfferingCategoryListComponent implements OnInit {

  offeringCategories: OfferingCategory[] = []
  submittedOfferings: SubmittedOffering[] = []
  currentOfferingCategory: OfferingCategory = {
    id:-1,
    name: '',
    description: '',
    status: OfferingCategoryType.ACCEPTED
  }
  displayedColumns = ['position', 'name', 'description', 'edit', 'delete'];
  displayedSubmittedColumns = ['position', 'offering name','category name', 'category description', 'approve']
  isSubmitted = false

  constructor(private offeringCategoryService: OfferingCategoryService, private dialog:MatDialog, private offeringService:OfferingService){}

  swicthSubmitted(){
    this.isSubmitted = !this.isSubmitted
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this.offeringCategoryService.getAll().subscribe({
      next:(categories: OfferingCategory[]) =>{
        this.offeringCategories = categories
      },
      error: () => {
        console.log("error")
      }
    })
  }


  onEdit(id: number) {
    this.offeringCategoryService.getById(id).pipe(
      switchMap((cat) => {
        const dialogRef = this.dialog.open(EditDialogComponent, {
          data:{
            category:cat,
          },
          width: '24rem',
        });
  
        //observable objekat which will be activated after closing dialog
        return dialogRef.afterClosed();
      })
    ).subscribe({
      next: (updatedCategory) => {
        if (updatedCategory) {
          this.updateCategory(updatedCategory);
        }
      },
      error: (err) => {
        console.error('Error fetching category:', err);
      },
    });
  }
  
  updateCategory(category: any) {
    this.offeringCategoryService.updateOfferingCategory(category.id, category).subscribe({
      next: (response) => {
        const index = this.offeringCategories.findIndex((item) => item.id === category.id);
      if (index !== -1) {
        this.offeringCategories[index] = category;
      }
      this.offeringCategories = [...this.offeringCategories];
      },
      error: (err) => {
        console.error('Error updating category:', err);
      },
    });
  }
  
  //submitted
  getAllSubmitted(){
    this.offeringService.getSubmittedOfferings().subscribe({
      next:(offers:SubmittedOffering[])=>{
        this.submittedOfferings = offers
      },
      error:(_) => {
        console.log("error")
      }
    })
  }

  onApprove(categoryId: number){
    this.offeringCategoryService.getSubmittedById(categoryId).pipe(
      switchMap((cat) => {
        const dialogRef = this.dialog.open(ApproveDialogComponent, {
          data:{
            submittedOffer:cat
          },width:'24rem'
        });
        return dialogRef.afterClosed();
      })
    ).subscribe({
      next:(offer : OfferingCategory)=>{
        if(offer){
          if(offer.status == OfferingCategoryType.ACCEPTED){
              // update offering, set ofering_cat_id to new 
              // delete submitted category
              // notify owner-a
              this.updateOffering();
          }else{
            offer.status = OfferingCategoryType.ACCEPTED
            this.offeringCategoryService.updateOfferingCategory(offer.id, offer).subscribe({
              next: (response) => {
                this.getAllSubmitted()
              },
              error: (err) => {
                console.error('Error updating category:', err);
              },
            });
          }
          
        }
      },
      error: (_) =>{
        console.log("error")
      }
    })
  }

  updateOffering(){
    
  }
}






