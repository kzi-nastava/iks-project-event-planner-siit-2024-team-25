import { Time } from "@angular/common";

export interface OfferingFilterParams {
  name?: string;
  eventType?: string;
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  country?: string;
  city?: string;
  startDate?: Date;
  startTime?: Time,
  endTime?: Time,
  endDate?: Date;
  sortCategory?: string,
  sortType?: string,
}
