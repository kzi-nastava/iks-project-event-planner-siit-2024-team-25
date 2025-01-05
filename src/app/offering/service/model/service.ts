import { EventType } from '../../model/event-type';
import { OfferingCategory } from "../../offering-category/model/offering-category";
import { Offeringtype } from '../../model/offering.type.enum';
import { ReservationType } from "./reservation.type.enum";

export interface Service {
    id: number,
    name: string,
    description: string,
    price: number,
    images: string[],
    discount: number,
    visible: boolean,
    available: boolean,
    offeringType: Offeringtype,
    specifics: string,
    duration: number,
    cancellationDeadline: number,
    reservationDeadline: number,
    reservationType: ReservationType,
    eventTypes: EventType[],
    offeringCategory: OfferingCategory,
    minimumArrangement:number,
    maximumArrangement: number,
    ownerInfo: {id: number, firstName:String, lastName:String}
}
