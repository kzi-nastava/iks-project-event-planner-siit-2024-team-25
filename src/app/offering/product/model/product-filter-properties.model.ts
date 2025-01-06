export interface ProductFilterProperties {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  available: boolean;
  eventTypeId?: number;
  categoryId?: number;
}
