import { UserRole } from "../../../infrastructure/auth/model/user-role.model";
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
    user: {id:number, firstName:String, lastName:String,profilePictureUrl:String, userRole:UserRole},
}