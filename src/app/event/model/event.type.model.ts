import { OfferingCategory } from './offering-category.model';

export interface EventType {
  id: number;
  name: string;
  description: string;
  isActive: string;
  categories: OfferingCategory[]
}
