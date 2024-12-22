




import { EventTypePreviewModel } from './event.type.preview.model';
import { PrivacyType } from './privacy-type.model';

export interface Event {
  id?: number;
  eventType: EventTypePreviewModel;
  name: string;
  description?: string;
  maxParticipants?: number;
  privacyType: PrivacyType;
  startDate: Date;
  endDate: Date;
  startTime: string; // hh:mm:ss
  endTime: string; // hh:mm:ss
  location: {
    country: string;
    city: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
}
