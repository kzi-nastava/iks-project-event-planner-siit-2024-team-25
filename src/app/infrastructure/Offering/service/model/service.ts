import { EventType } from "./event-type";
import { OfferingCategory } from "./offering-category";
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
    offeringTyoe: Offeringtype,
    specifics: string,
    duration: number,
    cancellationDate: number,
    reservationDate: number,
    reservationType: ReservationType,
    eventTypes: EventType[],
    offeringCategories: OfferingCategory[],
    minArrangement:number,
    maxArrangement: number,
}
