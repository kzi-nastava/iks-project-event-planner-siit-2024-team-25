import { UserRole } from './user-role.model';

export interface User {
  userId: number;
  email: string;
  fullName: string;
  role: UserRole;
}
