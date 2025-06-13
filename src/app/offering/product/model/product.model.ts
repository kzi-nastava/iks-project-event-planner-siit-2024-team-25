import { EventType } from '../../model/event-type';
import { Offeringtype } from '../../model/offering.type.enum';
import { OfferingCategory } from '../../offering-category/model/offering-category';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  visible: boolean;
  available: boolean;
  offeringType: Offeringtype;
  eventTypes: EventType[];
  offeringCategory: OfferingCategory;
  ownerInfo: { id: number; name: string };
  isFavorite: Boolean;
}
