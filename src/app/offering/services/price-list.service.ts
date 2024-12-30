import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PriceListItem } from '../model/price-list-mode';
import { environment } from '../../../environment/environment';
import { PriceListItemRequest } from '../model/price-list-requestDTO';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getProductsPriceList(ownerId?: number) : Observable<PriceListItem[]>{
    return this.httpClient.get<any>(environment.apiHost + "/api/price-list/" + ownerId + "/products");
  }

  getServicesPriceList(ownerId?: number) : Observable<PriceListItem[]>{
    return this.httpClient.get<any>(environment.apiHost + "/api/price-list/" + ownerId + "/services");
  }

  getPriceListItem(offeringId: number): Observable<PriceListItem>{
    return this.httpClient.get<any>(environment.apiHost + "/api/price-list/" + offeringId);
  }

  updatePriceListItem(offeringId:number, request:PriceListItemRequest):Observable<PriceListItem>{
    return this.httpClient.put<any>(environment.apiHost + "/api/price-list/" + offeringId, request);
  }
}
