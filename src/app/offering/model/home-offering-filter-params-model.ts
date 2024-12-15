import { Time } from '@angular/common';

export interface OfferingFilterParams {
  name?: string;
  eventTypeId?: number;
  categoryId?: number;
  maxPrice?: number;
  minPrice?: number;
  description?: string;
  sortCategory?: string;
  sortType?: string;
  criteria?: string;
}
