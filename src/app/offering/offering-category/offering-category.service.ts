import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OfferingCategory } from './model/offering-category';
import { ThumbPosition } from '@angular/material/slider/testing';

@Injectable({
  providedIn: 'root'
})
export class OfferingCategoryService {

  constructor(private httpClient: HttpClient) { }

  getAll():Observable<OfferingCategory[]>{
    return this.httpClient.get<OfferingCategory[]>("http://localhost:8080/api/offering-categories/");
  }
  getById(id:number):Observable<OfferingCategory>{
    return this.httpClient.get<OfferingCategory>("http://localhost:8080/api/offering-categories/"+id);
  }
  getSubmittedById(id:number):Observable<OfferingCategory>{
    return this.httpClient.get<OfferingCategory>("http://localhost:8080/api/offering-categories/submitted/"+id);
  }
  updateOfferingCategory(id:number, category:OfferingCategory):Observable<OfferingCategory>{
    return this.httpClient.put<OfferingCategory>("http://localhost:8080/api/offering-categories/"+id,category)
  }
  approveOfferingCategory(id:number, category:OfferingCategory, offeringId:number):Observable<OfferingCategory>{
    let params = new HttpParams();
    params = params.set("offeringId", offeringId);
    return this.httpClient.put<OfferingCategory>("http://localhost:8080/api/offering-categories/"+id+"/approve",category,{ params: params})
  }
  createOfferingCategory(category:OfferingCategory):Observable<OfferingCategory>{
    return this.httpClient.post<OfferingCategory>("http://localhost:8080/api/offering-categories/",category)
  }
  deleteOfferingCategory(id:number):Observable<OfferingCategory>{
    return this.httpClient.delete<OfferingCategory>("http://localhost:8080/api/offering-categories/"+id)
  }
}
