import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductPurchaseResponseDTO } from '../model/product-purchase-response';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(
    private httpClient: HttpClient
  ) { }

  purchaseProduct(eventId:number, productId:number) : Observable<ProductPurchaseResponseDTO>{
    const dto = {productId : productId}
    return this.httpClient.post<ProductPurchaseResponseDTO>(environment.apiHost + "/api/purchase/events/"+eventId+"/products", dto);
  }

}
