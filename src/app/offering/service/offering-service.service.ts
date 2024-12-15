import { Injectable } from '@angular/core';
import { Service } from './model/service';
import { Offeringtype } from './model/offering.type.enum';
import { ReservationType } from './model/reservation.type.enum';
import { map, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Page } from '../../shared/model/page.mode';
import { ServiceCreateDTO } from './model/serviceCreateDTO';
import { OfferingCategoryType } from '../offering-category/model/offering-category-type.enum';

@Injectable({
  providedIn: 'root'
})
export class OfferingServiceService {

  constructor(private httpClinet: HttpClient) { }

  getAll(properties: any): Observable<Service[]> {
    let params = new HttpParams();
    if(properties){
      if(properties.name != ""){
        params = params.set('name', properties.name)
      }
      if(properties.price > 0){
        params = params.set('price', properties.price)
      }
      if(properties.availableFilter){
        params = params.set('available', properties.available)
      }
    }
    console.log(params)
    return this.httpClinet
    .get<Page<Service>>("http://localhost:8080/api/services",{ params: params})
    .pipe(map((page) => page.content));
  }

  /*getServiceById(id: number): Observable<Service> {
    const s = this.services.find(service => service.id === id);
    if (s) {
      return of(s); 
    } else {
      return throwError(() => new Error(`Service with ID ${id} not found`)); 
    }
  }*/

  addService(s: ServiceCreateDTO): Observable<Service> {
    console.log(s)
    return this.httpClinet.post<Service>("http://localhost:8080/api/services",s)
  }

  /*updateService(updatedService: Service|undefined): Observable<Service> {
    if(updatedService != null){
      const index = this.services.findIndex(service => service.id === updatedService.id);
      if (index !== -1) {
        this.services[index] = updatedService;
        console.log('Service you updated: ');
        console.log(updatedService);
        return of(updatedService);
      }
    }
    return of();
  }*/
}
