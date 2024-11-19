import { Time } from '@angular/common';

export interface HomeEventFilterParams {
  name?: string;
  description?: string;
  maxParticipants?: string;
  startDate?: Date;
  startTime?: Time;
  endDate?: Date;
  endTime?: Time;
  sortCategory?: string;
  sortType?: string;
  eventType?: string;
  country?: string;
  city?: string;
}
