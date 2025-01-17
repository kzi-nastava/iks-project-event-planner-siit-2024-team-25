import { ReviewStatus } from "./review-status";
import { ReviewType } from "./review-type";

export interface Review{
    id: number,
    comment: string,
    rating: number,
    reviewType: ReviewType,
    reviewStatus: ReviewStatus,
    createdDate: Date,
    purchaseId: number,
}