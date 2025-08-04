import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, switchMap, throwError } from 'rxjs';
import { BudgetItem } from '../model/budget-item.model';
import { environment } from '../../../environment/environment';
import { OfferingCategoryService } from '../../offering/offering-category/offering-category.service';
import { BudgetItemRequestDTO } from '../model/budget-item-request.dto';
import { ErrorResponse } from '../../shared/model/error.response.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetPlanService {
  constructor(
    private httpClient: HttpClient,
    private offeringCategoryService: OfferingCategoryService
  ) {}

  getBudgetItemsByEvent(eventId: number): Observable<BudgetItem[]> {
    let params = new HttpParams().set('eventId', eventId);
    return this.httpClient
      .get<any[]>(environment.apiHost + '/api/budget-items/', { params })
      .pipe(
        switchMap((items) => {
          const requests = items.map((item) =>
            this.offeringCategoryService.getById(item.offeringCategoryId).pipe(
              map((category) => ({
                ...item,
                offeringCategory: category,
              }))
            )
          );
          return forkJoin(requests);
        })
      );
  }

  isOfferingCategorySuitableForEvent(
    eventId: number,
    offeringCategoryId: number
  ): Observable<Boolean> {
    let params = new HttpParams().set('eventId', eventId);
    return this.httpClient.get<Boolean>(
      environment.apiHost +
        `/api/budget-items/${offeringCategoryId}/is-suitable`,
      { params: params }
    );
  }

  createBudgetItemForEevnt(
    request: BudgetItemRequestDTO
  ): Observable<BudgetItem> {
    return this.httpClient.post<BudgetItem>(
      environment.apiHost + '/api/budget-items/',
      request
    );
  }
  updateBudgetItem(
    request: BudgetItemRequestDTO,
    id: number
  ): Observable<BudgetItem> {
    return this.httpClient.put<BudgetItem>(
      environment.apiHost + '/api/budget-items/' + id,
      request
    ).pipe(
    catchError((error: HttpErrorResponse) => {
      const customError: ErrorResponse = {
        code: error.status,
        message: error.error?.message || 'Unknown error',
        errors: error.error?.errors || {}
      };
      return throwError(() => customError);
    })
  );
  }
deleteBudgetItem(id: number): Observable<void> {
  return this.httpClient.delete<void>(
    environment.apiHost + '/api/budget-items/' + id
  ).pipe(
    catchError((error: HttpErrorResponse) => {
      const customError: ErrorResponse = {
        code: error.status,
        message: error.error?.message || 'Unknown error',
        errors: error.error?.errors || {}
      };
      return throwError(() => customError);
    })
  );
}

  getLeftMoneyForBudgetItem(
    eventId: number,
    offeringCategoryId: number
  ): Observable<number> {
    let params = new HttpParams().set('categoryId', offeringCategoryId);
    return this.httpClient.get<number>(
      environment.apiHost + `/api/purchase/event/${eventId}/budget`,
      {
        params: params,
      }
    );
  }
}
