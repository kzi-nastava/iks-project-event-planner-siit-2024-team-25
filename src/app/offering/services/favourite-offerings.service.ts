import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceCreateDTO } from '../service/model/serviceCreateDTO';
import { environment } from '../../../environment/environment';
import { ProductPurchase } from '../../event/model/product-purchase.model';
import { FavouriteOffering } from '../model/favorite-offering.model';
import { ServicePurchaseCard } from '../../event/model/service-purchase-card.model';
import { Service } from '../service/model/service';
import { HomeOffering } from '../model/home-offering.model';

@Injectable({
  providedIn: 'root'
})
export class FavouriteOfferingsService {

  constructor(
    private httpClient:HttpClient
  ) { }

  getFavoriteService(userId: number) : Observable<HomeOffering[]>{
    return this.httpClient.get<any>(environment.apiHost + '/api/users/' + userId + '/favourite-services');
  }
  getFavoriteProducts(userId: number) : Observable<HomeOffering[]>{
    return this.httpClient.get<any>(environment.apiHost + '/api/users/' + userId + '/favourite-products');
  }

  addFavoriteService(userId: number, request: FavouriteOffering) : Observable<ServicePurchaseCard>{
    return this.httpClient.post<any>(environment.apiHost + '/api/users/' + userId+ '/favourite-services', request);
  }

  addFavoriteProduct(userId: number, request: FavouriteOffering): Observable<ProductPurchase>{
    return this.httpClient.post<any>(environment.apiHost + '/api/users/' + userId + '/favourite-products', request);
  }

  deleteFavoriteService(userId: number, offeringId: number):Observable<void>{
    return this.httpClient.delete<any>(environment.apiHost + '/api/users/' + userId + '/favourite-service/' + offeringId);
  }
  deleteFavoriteProduct(userId: number, offeringId: number) : Observable<void>{
    return this.httpClient.delete<any>(environment.apiHost + '/api/users/' + userId + '/favourite-product/' + offeringId);
  }
}
