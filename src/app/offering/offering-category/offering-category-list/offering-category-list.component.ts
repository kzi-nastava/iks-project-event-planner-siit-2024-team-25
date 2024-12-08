import { Component, OnInit } from '@angular/core';
import { OfferingCategoryService } from '../offering-category.service';
import { Router } from '@angular/router';
import { OfferingCategory } from '../model/offering-category';
import { EditDialogComponent } from '../dialogs/edit-dialog/edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OfferingCategoryType } from '../model/offering-category-type.enum';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-offering-category-list',
  templateUrl: './offering-category-list.component.html',
  styleUrl: './offering-category-list.component.scss'
})
export class OfferingCategoryListComponent implements OnInit {

  offeringCategories: OfferingCategory[] = []
  currentOfferingCategory: OfferingCategory = {
    id:-1,
    name: '',
    description: '',
    type: OfferingCategoryType.ACCEPTED
  }
  displayedColumns = ['position', 'name', 'description', 'edit', 'delete'];

  constructor(private offeringCategoryService: OfferingCategoryService, private router: Router, private dialog:MatDialog){}

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
  
}






