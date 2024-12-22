import { OfferingCategoryType } from "../../offering/offering-category/model/offering-category-type.enum";
import { Event } from "./event.model";
import { OfferingCategory } from "./offering-category.model";

export interface BudgetItem{
    id?: number | undefined;
    budget: number;
    offeringCategory? : OfferingCategory| undefined;
    event : Event
}