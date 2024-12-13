import { Injectable } from '@angular/core';
import { Service } from './model/service';
import { Offeringtype } from './model/offering.type.enum';
import { ReservationType } from './model/reservation.type.enum';
import { forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Page } from '../../shared/model/page.mode';
import { ServiceCreateDTO } from './model/serviceCreateDTO';
import { OfferingCategoryType } from '../offering-category/model/offering-category-type.enum';
import { ServiceUpdateDTO } from './model/serviceUpdateDTO';
import { OfferingCategoryService } from '../offering-category/offering-category.service';
import { OfferingCategory } from '../offering-category/model/offering-category';
import { EventTypeService } from '../../event/service/event-type.service';

@Injectable({
  providedIn: 'root'
})
export class OfferingServiceService {

  constructor(private httpClinet: HttpClient, private offeringCategoryService: OfferingCategoryService, private eventTypesService: EventTypeService) { }

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
      if(properties.eventTypeId != -1){
        params = params.set('eventTypeId', properties.eventTypeId)
      }
      if(properties.offeringCategoryTypeId != -1){
        params = params.set('offeringCategoryId', properties.offeringCategoryTypeId)
      }
    }
    return this.httpClinet
    .get<Page<Service>>("http://localhost:8080/api/services",{ params: params})
    .pipe(map((page) => page.content));
  }

  getServiceById(id: number): Observable<Service> {
    return this.httpClinet.get<any>(`http://localhost:8080/api/services/${id}`).pipe(
      switchMap(response => {
        return forkJoin([
          this.offeringCategoryService.getById(response.offeringCategoryID), 
          this.eventTypesService.getEventTypesByIds(response.eventTypesIDs)  
        ]).pipe(
          map(([category, eventTypes]) => ({
            ...response,
            offeringCategory: category,
            eventTypes: eventTypes
          }))
        );
      })
    );
  }

  addService(s: ServiceCreateDTO): Observable<Service> {
    return this.httpClinet.post<Service>("http://localhost:8080/api/services",s)
  }

  updateService(updatedService: ServiceUpdateDTO, id:number): Observable<Service> {
    return this.httpClinet.put<Service>("http://localhost:8080/api/services/"+id,updatedService);
  }
}
