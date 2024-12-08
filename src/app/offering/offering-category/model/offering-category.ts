import { OfferingCategoryType } from "./offering-category-type.enum";

export interface OfferingCategory {
    id: number
    name: string;
    description: string;
    status: OfferingCategoryType
}
