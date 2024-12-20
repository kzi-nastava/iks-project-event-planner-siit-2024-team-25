import { EventType } from "./event.type.model";
import { OfferingCategory } from "./offering-category.model";

export interface Event{
    id: number;
    name: String;
    eventType: EventType;
}