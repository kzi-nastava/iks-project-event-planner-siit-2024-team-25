import { Component } from '@angular/core';
import { Review } from '../models/review.model';
import { ReviewService } from '../services/review.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewStatus } from '../models/review-status.model';
import { Page } from '../../shared/model/page.mode';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { ToastrService } from 'ngx-toastr';
import { ApproveDialogComponent } from '../../offering/offering-category/dialogs/approve-dialog/approve-dialog.component';
import { ApproveReviewDialogComponent } from '../approve-review-dialog/approve-review-dialog.component';

@Component({
  selector: 'app-all-reviews',
  templateUrl: './all-reviews.component.html',
  styleUrl: './all-reviews.component.scss',
})
export class AllReviewsComponent {
  currentReviews: Review[] = [];
  displayedColumns = [
    'position',
    'comment',
    'rating',
    'createdDate',
    'actions',
  ];

  currentPage: number = 0;
  totalPages: number = 1;
  pageSize: number = 10;

  constructor(
    private reviewService: ReviewService,
    private dialog: MatDialog,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllReviews();
  }

  getAllReviews() {
    this.reviewService
      .getAllReviews(this.currentPage, ReviewStatus.PENDING)
      .subscribe({
        next: (response: Page<Review>) => {
          this.totalPages = response.totalPages;
          this.currentReviews = response.content;
        },
        error: (err: ErrorResponse) => {
          this.toastrService.error(err.message, 'Error');
        },
      });
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getAllReviews();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getAllReviews();
    }
  }

  onApprove(reviewId: number) {
    const dialogRef = this.dialog.open(ApproveReviewDialogComponent, {
      data: {
        reviewId: reviewId,
      },
      width: '24rem',
    });
    dialogRef.afterClosed().subscribe({
      next: (check) => {
        let status = ReviewStatus.APPROVED;
        if (!check) {
          status = ReviewStatus.DENIED;
        }
        this.reviewService.updateReview(reviewId, status).subscribe({
          next: () => {
            this.toastrService.success(
              `You successfully updated review`,
              'Success'
            );
            this.getAllReviews();
          },
          error: (err: ErrorResponse) => {
            this.toastrService.error(err.message, 'Error');
          },
        });
      },
      error: (err: ErrorResponse) => {
        this.toastrService.error(err.message, 'Error');
      },
    });
  }
}
