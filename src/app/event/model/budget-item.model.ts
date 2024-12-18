import { OfferingCategoryType } from "../../offering/offering-category/model/offering-category-type.enum";

export interface BudgetItem{
    id:number | undefined;
    money: number;
    offeringCategoryType : OfferingCategoryType;
    //event: Event // there is no event model
}