export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePicture?: File | null;
  userRole: 'OWNER' | 'EVENT_ORGANIZER';
  ownerFields?: OwnerFields; // Optional, required only for OWNER role
  eventOrganizerFields?: EventOrganizerFields; // Optional, required only for ORGANIZER role
}

export interface OwnerFields {
  companyName: string;
  companyAddress: {
    country: string;
    city: string;
    address: string;
  };
  contactPhone: string;
  description: string;
  companyPictures?: File[];
}

export interface EventOrganizerFields {
  livingAddress: {
    country: string;
    city: string;
    address: string;
  };
  phoneNumber: string;
}
