import { NullableDevkitMigration } from "@angular/cdk/schematics";
import { Offeringtype } from "./offering.type.enum";
import { ReservationType } from "./reservation.type.enum";

export interface ServiceCreateDTO{
    name?: string | null,
    description?: string | null,
    price?: number | null,
    images: string[],
    discount: number,
    visible?: boolean | null,
    available?: boolean | null,
    specifics: string,
    duration: number,
    cancellationDeadline: number,
    reservationDeadline: number,
    reservationType: ReservationType,
    minimumArrangement:number,
    maximumArrangement: number,
    ownerId: number;
    eventTypesIDs?: number[] | null,
    offeringCategoryName?: String | null,
    offeringCategoryID?: number | null;
}