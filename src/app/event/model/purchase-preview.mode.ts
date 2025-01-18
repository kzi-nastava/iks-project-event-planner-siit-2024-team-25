export interface PurchasePreview{
    id:number,
    price: {currency:string, amount:number},
    offering: {id: number, name: string}
}