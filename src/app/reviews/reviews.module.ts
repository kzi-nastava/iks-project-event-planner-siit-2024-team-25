import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllReviewsComponent } from './all-reviews/all-reviews.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { ReviewsRoutingModule } from './reviews-routing.module';

@NgModule({
  declarations: [AllReviewsComponent],
  imports: [CommonModule, MaterialModule, ReviewsRoutingModule],
})
export class ReviewsModule {}
