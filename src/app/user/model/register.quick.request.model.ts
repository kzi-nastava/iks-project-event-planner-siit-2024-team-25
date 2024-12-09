export interface RegisterQuickRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePicture?: File | null;
  userRole: 'REGULAR';
  invitationCode: string | null;
}
