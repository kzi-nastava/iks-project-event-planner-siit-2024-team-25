export interface Product{
    id: number,
    name: number,
    description: String,
    price: number,
    discount: number,
    images: String[],
    available: boolean,
    eventTypes: {id: number, name:String}[],
    offeringCategory: {id: number, name:String}
    ownerInfo: {id: number, firstName:String, lastName:String}
}