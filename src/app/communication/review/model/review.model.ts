import { UserRole } from '../../../infrastructure/auth/model/user-role.model';
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
  user: {
    id: number;
    firstName: String;
    lastName: String;
    profilePictureUrl: String;
    userRole: UserRole;
  };
  eventOfferingName: string;
}
