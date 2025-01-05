export interface ReportUser {
  userId: number;
  userFirstName: string;
  userLastName: string;
  reportMessage: string;
  reportedUserId: number;
  reportedUserName: string;
  isViewed: boolean;
  createdDate: Date;
}
