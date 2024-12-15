import { EventType } from "./event-type";
import { OfferingCategory } from "../../offering-category/model/offering-category";
import { Offeringtype } from "./offering.type.enum";
import { ReservationType } from "./reservation.type.enum";

export interface Service {
    id: number,
    name: string,
    description: string,
    price: number,
    images: string[],
    discount: number,
    isVisible: boolean,
    isAvailable: boolean,
    offeringType: Offeringtype,
    specifics: string,
    duration: number,
    cancellationDeadline: number,
    reservationDeadline: number,
    reservationType: ReservationType,
    eventTypes: EventType[],
    offeringCategory: OfferingCategory,
    minArrangement:number,
    maxArrangement: number,
}
