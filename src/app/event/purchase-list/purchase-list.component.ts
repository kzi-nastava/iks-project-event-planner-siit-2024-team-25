import { Component, OnInit } from '@angular/core';
import { PurchasePreview } from '../model/purchase-preview.mode';
import { PurchaseService } from '../service/purchase.service';
import { ReviewMakeComponent } from '../../communication/review/review-make/review-make.component';
import { MatDialog } from '@angular/material/dialog';
import { ReviewService } from '../../communication/review/services/review.service';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { Review } from '../../communication/review/model/review-model';
import { ReviewType } from '../../communication/review/model/review-type';
import { UserRole } from '../../infrastructure/auth/model/user-role.model';
import { PurchasePreviewWithCount } from '../model/purchasePreviewWithCount.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.scss',
})
export class PurchaseListComponent implements OnInit {
  displayedColumns = ['position', 'Ename', 'name', 'price', 'review'];
  purchaseList: PurchasePreview[] = [];

  eventId: number | any = null;
  offeringId: number | any = null;
  reviewType: ReviewType = ReviewType.OFFERING_REVIEW;

  userId: number;
  purchaseId: number | any;

  constructor(
    private purchaseService: PurchaseService,
    private dialog: MatDialog,
    private reviewService: ReviewService,
    private authService: AuthService,
    private toastService: ToastrService
  ) {
    this.userId = this.authService.getUser()?.userId || -1;
  }
  ngOnInit(): void {
    const eventFromState = window.history.state['eventId'];
    if (eventFromState) {
      this.eventId = eventFromState;
    } else {
      console.log('event id not found');
      const offeringFromState = window.history.state['offeringId'];
      if (offeringFromState) {
        this.offeringId = offeringFromState;
      } else {
        console.log('offering id not found');
      }
    }
    if (this.authService.getUser()?.role == UserRole.EventOrganizer) {
      this.reviewType = ReviewType.OFFERING_REVIEW;
    } else if (this.authService.getUser()?.role == UserRole.Owner) {
      this.reviewType = ReviewType.EVENT_REVIEW;
    }
    this.getPurchaseList();
  }

  getPurchaseList() {
    if (this.eventId == null) {
      this.purchaseService.getPurchaseByOffering(this.offeringId).subscribe({
        next: (res) => {
          this.purchaseList = res;
        },
        error: () => {
          this.toastService.error('Error', 'Failed to load');
        },
      });
    } else {
      this.purchaseService.getPurchaseByEvent(this.eventId).subscribe({
        next: (res) => {
          this.purchaseList = res;
        },
        error: () => {
          this.toastService.error('Error', 'Failed to load');
        },
      });
    }
  }
  makeReview(purchase: PurchasePreview) {
    const dialogRef = this.dialog.open(ReviewMakeComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const reviewRequest = this.getReview(result, purchase.id);
        console.log(reviewRequest);
        this.reviewService.postReview(reviewRequest).subscribe({
          next: (res) => {
            console.log(res);
          },
          error: () => {
            console.log('error');
          },
        });
      }
    });
  }

  getReview(res: any, purchaseId: number): any {
    return {
      comment: res.comment,
      rating: res.rating,
      reviewType: this.reviewType,
      purchaseId: purchaseId,
      userId: this.userId,
    };
  }
}
