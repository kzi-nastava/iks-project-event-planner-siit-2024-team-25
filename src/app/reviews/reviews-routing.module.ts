import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AllReviewsComponent } from './all-reviews/all-reviews.component';
import { roleGuard } from '../infrastructure/auth/guard/role.guard';
import { UserRole } from '../infrastructure/auth/model/user-role.model';

const routes: Routes = [
  {
    path: '',
    component: AllReviewsComponent,
    canActivate: [roleGuard],
    data: { roles: [UserRole.Admin] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewsRoutingModule {}
