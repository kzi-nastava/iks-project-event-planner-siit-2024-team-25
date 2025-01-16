export interface UserRequest {
  firstName: string;
  lastName: string;
  profilePicture?: File | null;
  removeProfilePicture?: boolean;
  userRole: 'OWNER' | 'EVENT_ORGANIZER';
  ownerFields?: OwnerFields; // Optional, required only for OWNER role
  eventOrganizerFields?: EventOrganizerFields; // Optional, required only for EVENT_ORGANIZER role
}

export interface RegisterRequest extends UserRequest {
  email: string;
  password: string;
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
  picturesToRemove?: string[];
}

export interface EventOrganizerFields {
  livingAddress: {
    country: string;
    city: string;
    address: string;
  };
  phoneNumber: string;
}
