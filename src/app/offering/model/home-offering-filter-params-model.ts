import { Time } from '@angular/common';

export interface OfferingFilterParams {
  name?: string;
  eventTypeId?: string;
  categoryId?: string;
  maxPrice?: number;
  minPrice?: number;
  description?: string;
  sortCategory?: string;
  sortType?: string;
  criteria?: string;
}
