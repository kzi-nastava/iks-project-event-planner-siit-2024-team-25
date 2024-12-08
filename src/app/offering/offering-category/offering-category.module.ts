import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferingCategoryListComponent } from './offering-category-list/offering-category-list.component';
import { OfferingCategoryRoutingModule } from './offering-category-routing.module';
import { MaterialModule } from '../../infrastructure/material/material.module';
import { EditDialogComponent } from './dialogs/edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';



@NgModule({
  declarations: [
    OfferingCategoryListComponent,
    EditDialogComponent,
    DeleteDialogComponent
  ],
  imports: [
    CommonModule,
    OfferingCategoryRoutingModule,
    MaterialModule
  ]
})
export class OfferingCategoryModule { }
