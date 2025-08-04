import { UserRole } from '../../infrastructure/auth/model/user-role.model';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  userRole: UserRole;
}

export interface EventOrganizer extends User {
  livingAddress: {
    country: string;
    city: string;
    address: string;
  };
  phoneNumber: string;
}

export interface Owner extends User {
  companyName: string;
  companyAddress: {
    country: string;
    city: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  contactPhone: string;
  description: string;
  companyPictures: string[];
}
