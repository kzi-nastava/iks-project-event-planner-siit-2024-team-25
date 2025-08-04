import { OfferingCategoryType } from "./offering-category-type.enum";

export interface SubmittedOffering{
    offeringId:number,
    offeringName:String,
    categoryId: number,
    categoryName: String,
    description: String,
    status: OfferingCategoryType
}