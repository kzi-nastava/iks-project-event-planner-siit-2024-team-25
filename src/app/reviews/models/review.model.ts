import { ReviewStatus } from './review-status.model';
import { ReviewType } from './review-type.model';

export interface Review {
  id: number;
  comment: string;
  rating: number;
  reviewType: ReviewType;
  reviewStatus: ReviewStatus;
  createdDate: Date;
  purchaseId: number;
}
