import { Offeringtype } from '../../model/offering.type.enum';
import { ReservationType } from "./reservation.type.enum";

export interface ServiceUpdateDTO{
    name?: String | null,
    description? :String | null,
    price? : number | null,
    discount?:number,
    images?:File[],
    visible?: Boolean | null,
    available?: Boolean | null,
    specifics: string,
    status: Offeringtype,
    reservationType: ReservationType,
    duration: number,
    cancellationDeadline: number,
    reservationDeadline: number,
    minimumArrangement:number,
    maximumArrangement: number,
    eventTypesIDs?:Number[]|null,
    imagesToDelete: String[]
}
