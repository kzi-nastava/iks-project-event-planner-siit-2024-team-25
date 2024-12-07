import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferingCategoryListComponent } from './offering-category-list/offering-category-list/offering-category-list.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'offering-categories', component: OfferingCategoryListComponent },
]

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class OfferingCategoryRoutingModule { }
