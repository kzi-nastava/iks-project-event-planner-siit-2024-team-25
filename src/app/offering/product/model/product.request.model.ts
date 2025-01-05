export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  discount: number;
  visible: boolean;
  available: boolean;
  images: File[];
  eventTypeIds: number[];
  offeringCategoryId?: number;
  offeringCategoryName?: string;
  ownerId: number;
  imagesToDelete?: string[];
}
