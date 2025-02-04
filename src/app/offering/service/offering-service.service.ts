import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import { EventTypeService } from '../../event/service/event-type.service';
import { Page } from '../../shared/model/page.mode';
import { PurchaseRequest } from '../model/purchase.request.model';
import { OfferingCategoryService } from '../offering-category/offering-category.service';
import { Service } from './model/service';
import { ServiceCreateDTO } from './model/serviceCreateDTO';
import { ServiceUpdateDTO } from './model/serviceUpdateDTO';
import { ErrorResponse } from '../../shared/model/error.response.model';

@Injectable({
  providedIn: 'root',
})
export class OfferingServiceService {
  constructor(
    private httpClinet: HttpClient,
    private offeringCategoryService: OfferingCategoryService,
    private eventTypesService: EventTypeService,
    private datePipe: DatePipe
  ) { }

  getAll(properties: any): Observable<Service[]> {
    let params = new HttpParams();
    if (properties) {
      if (properties.name != '') {
        params = params.set('name', properties.name);
      }
      if (properties.price > 0) {
        params = params.set('price', properties.price);
      }
      if (properties.availableFilter) {
        params = params.set('available', properties.available);
      }
      if (properties.eventTypeId != -1) {
        params = params.set('eventTypeId', properties.eventTypeId);
      }
      if (properties.offeringCategoryTypeId != -1) {
        params = params.set(
          'offeringCategoryId',
          properties.offeringCategoryTypeId
        );
      }
    }
    return this.httpClinet
      .get<Page<Service>>('http://localhost:8080/api/services', {
        params: params,
      })
      .pipe(map((page) => page.content));
  }

  getServiceById(id: number): Observable<Service> {
    return this.httpClinet.get<any>(`http://localhost:8080/api/services/${id}`);
  }

  addService(s: ServiceCreateDTO): Observable<Service> {
    return this.httpClinet.post<Service>(
      'http://localhost:8080/api/services',this.buildFormData(s))
    .pipe(map(this.mapImages), catchError(this.handleError));
  }

  buildFormData(service : ServiceCreateDTO): FormData{
    let formData = new FormData();
    formData.append('name', service.name ?? "");
    formData.append('description', service.description??"");
    formData.append('price', service.price?.toString() ?? "");
    formData.append('discount', service.discount.toString()??"");
    for (const image of service.images) {
      formData.append('images', image, image.name);
    }
    formData.append('visible', service.visible?.toString()??"");
    formData.append('available', service.available?.toString()??"");
    formData.append('specifics', service.specifics??"");
    formData.append('reservationType', service.reservationType.toString()??"");
    formData.append('duration', service.duration.toString());
    formData.append('reservationDeadline', service.reservationDeadline.toString());
    formData.append('cancellationDeadline', service.cancellationDeadline.toString());
    formData.append('minimumArrangement', service.minimumArrangement.toString());
    formData.append('maximumArrangement', service.maximumArrangement.toString());
    for(const eventTypeId of service.eventTypesIDs?? []){
      formData.append('eventTypesIDs', eventTypeId.toString());
    }
    formData.append('offeringCategoryID', service.offeringCategoryID?.toString()??"");
    formData.append('offeringCategoryName', service.offeringCategoryName?.toString()??"");
    formData.append('ownerId', service.ownerId?.toString()??"");

    return formData;
  }

  updateService(
    updatedService: ServiceUpdateDTO,
    id: number
  ): Observable<Service> {
    return this.httpClinet.put<Service>(
      'http://localhost:8080/api/services/' + id,
      updatedService
    );
  }
  deleteService(id: number): Observable<void> {
    return this.httpClinet.delete<void>(
      'http://localhost:8080/api/services/' + id
    );
  }

  isServiceAvailable(
    eventId: number,
    serviceId: number,
    purchase: PurchaseRequest
  ): Observable<boolean> {
    let params = new HttpParams();

    if (purchase) {
      if (purchase.startDate) {
        params = params.set(
          'startDate',
          this.datePipe.transform(purchase.startDate, 'yyyy-MM-dd')!
        );
      }
      if (purchase.endDate) {
        params = params.set(
          'endDate',
          this.datePipe.transform(purchase.endDate, 'yyyy-MM-dd')!
        );
      }
      if (purchase.startTime) {
        params = params.set('startTime', purchase.startTime);
      }
      if (purchase.endTime) {
        params = params.set('endTime', purchase.endTime);
      }
    }

    return this.httpClinet.get<boolean>(
      `${environment.apiHost}/api/purchase/service/${serviceId}/available`,
      { params: params }
    );
  }

  bookService(
    eventId: number,
    serviceId: number,
    purchase: PurchaseRequest
  ): Observable<boolean> {
    return this.httpClinet.post<boolean>(
      `${environment.apiHost}/api/purchase/event/${eventId}/service/${serviceId}`,
      purchase
    );
  }
  private mapImages(service: Service): Service {
    service.images = service.images.map(
      (image) =>
        environment.apiHost + `/api/services/${service.id}/images/${image}`
    );
    return service;
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorResponse: ErrorResponse | null = null;

    if (error.error && typeof error.error === 'object') {
      errorResponse = error.error as ErrorResponse;
    }

    return throwError(
      () =>
      ({
        code: error.status,
        message: errorResponse?.message ?? error.message,
        errors: errorResponse?.errors,
      } as ErrorResponse)
    );
  }
}
