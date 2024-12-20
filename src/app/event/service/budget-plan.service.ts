import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { BudgetItem } from '../model/budget-item.model';
import { environment } from '../../../environment/environment';
import { OfferingCategoryService } from '../../offering/offering-category/offering-category.service';
import { BudgetItemRequestDTO } from '../model/budget-item-request.dto';

@Injectable({
  providedIn: 'root'
})
export class BudgetPlanService {

  constructor(private httpClient:HttpClient, private offeringCategoryService: OfferingCategoryService) { }

  getBudgetItemsByEvent(eventId: number): Observable<BudgetItem[]>{
    let params = new HttpParams()
    .set('eventId', eventId)
    return this.httpClient.get<any[]>(environment.apiHost + "/api/budget-items/", { params }).pipe(
      switchMap(items => {
        const requests = items.map(item =>
          this.offeringCategoryService.getById(item.offeringCategoryId).pipe(
            map(category => ({
              ...item, 
              offeringCategory: category,
            }))
          )
        );
        return forkJoin(requests);
      })
    );
  }

  createBudgetItemForEevnt(request: BudgetItemRequestDTO):Observable<BudgetItem>{
    return this.httpClient.post<BudgetItem>(environment.apiHost + "/api/budget-items", request)
  }
}
