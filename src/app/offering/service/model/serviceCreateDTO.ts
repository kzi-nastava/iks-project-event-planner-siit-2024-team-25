import { Offeringtype } from "./offering.type.enum";
import { ReservationType } from "./reservation.type.enum";

export interface ServiceCreateDTO{
    name?: string | null,
    description: string,
    price: number,
    images: string[],
    discount: number,
    isVisible: boolean,
    isAvailable: boolean,
    specifics: string,
    duration: number,
    cancellationDeadline: number,
    reservationDeadline: number,
    reservationType: ReservationType,
    ownerId: number;
    eventTypesIDs: number[],
    offeringCategoryID: number;
}