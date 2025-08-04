import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { OfferingCategory } from './model/offering-category';
import { ThumbPosition } from '@angular/material/slider/testing';
import { OfferingCategoryPreview } from './model/offering-category.preview.model';
import { ErrorResponse } from '../../shared/model/error.response.model';

@Injectable({
  providedIn: 'root'
})
export class OfferingCategoryService {

  constructor(private httpClient: HttpClient) { }

  getAll():Observable<OfferingCategory[]>{
    return this.httpClient.get<OfferingCategory[]>("http://localhost:8080/api/offering-categories/");
  }
  getAllCategories():Observable<OfferingCategoryPreview[]>{
    return this.httpClient.get<OfferingCategoryPreview[]>("http://localhost:8080/api/offering-categories/all");
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
    return this.httpClient.delete<OfferingCategory>("http://localhost:8080/api/offering-categories/"+id).pipe(map((value) => {
              return value;
            }),
            catchError(this.handleError))
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
