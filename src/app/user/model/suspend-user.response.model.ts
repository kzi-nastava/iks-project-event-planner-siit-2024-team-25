export interface SuspendUserResponse {
  id?: number;
  suspendedUserId?: number;
  suspendedUserFirstName?: string;
  suspendedUserLastName?: string;
  expirationTime?: Date;
}
