import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferingCategoryListComponent } from './offering-category-list/offering-category-list/offering-category-list.component';
import { OfferingCategoryRoutingModule } from './offering-category-routing.module';



@NgModule({
  declarations: [
    OfferingCategoryListComponent
  ],
  imports: [
    CommonModule,
    OfferingCategoryRoutingModule
  ]
})
export class OfferingCategoryModule { }
