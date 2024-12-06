import { Time } from '@angular/common';

export interface HomeEventFilterParams {
  [key: string]: any;
  nameContains?: string;
  descriptionContains?: string;
  maxParticipants?: string;
  startDate?: Date;
  startTime?: string;
  endDate?: Date;
  endTime?: string;
  sortBy?: string;
  sortDirection?: string;
  eventTypeId?: number;
  country?: string;
  city?: string;
}
