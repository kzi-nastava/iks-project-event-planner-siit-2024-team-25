import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './model/product';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  constructor(private httpClient: HttpClient
  ) { }

  getProductById(id:number):Observable<Product>{
    return this.httpClient.get<any>(environment.apiHost + "/api/products/"+id);
  }
}
