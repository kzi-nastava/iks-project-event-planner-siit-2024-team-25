import { Injectable } from '@angular/core';
import { HomeOffering } from '../model/home-offering.model';
import { map, Observable, of } from 'rxjs';
import { OfferingFilterParams } from '../model/home-offering-filter-params-model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { Page } from '../../shared/model/page.mode';

@Injectable({
  providedIn: 'root',
})
export class OfferingService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getTopOfferings(): Observable<HomeOffering[]> {
    const user = this.authService.getUser();

    let params = new HttpParams();

    if (user) {
      params = params.set('country', user.country ?? '');
      params = params.set('city', user.city ?? '');
    }

    return this.httpClient
      .get<Page<HomeOffering>>('http://localhost:8080/api/offerings/top', {
        params,
      })
      .pipe(map((page) => page.content));
  }

  getOfferings(
    page: number,
    filterParams?: OfferingFilterParams
  ): Observable<{ currentOfferings: HomeOffering[]; totalPages: number }> {
    if (filterParams) {
      if (filterParams.criteria === 'SERVICES') {
        return this.getAllServices(page, filterParams);
      } else if (filterParams.criteria === 'PRODUCTS') {
        return this.getAllProducts(page, filterParams);
      }
      return this.getAllOfferings(page, filterParams);
    }
    return this.getAllOfferings(page, filterParams);
  }

  getAllProducts(
    page: number,
    filterParams?: OfferingFilterParams
  ): Observable<{ currentOfferings: HomeOffering[]; totalPages: number }> {
    let params = this.getHttpParams(filterParams);
    console.log(params);

    params = params.set('page', page);

    return this.httpClient
      .get<Page<HomeOffering>>('http://localhost:8080/api/products/all', {
        params,
      })
      .pipe(
        map((page) => ({
          currentOfferings: page.content,
          totalPages: page.totalPages,
        }))
      );
  }
  getAllServices(
    page: number,
    filterParams?: OfferingFilterParams
  ): Observable<{ currentOfferings: HomeOffering[]; totalPages: number }> {
    let params = this.getHttpParams(filterParams);
    console.log(params);

    params = params.set('page', page);

    return this.httpClient
      .get<Page<HomeOffering>>('http://localhost:8080/api/services/all', {
        params,
      })
      .pipe(
        map((page) => ({
          currentOfferings: page.content,
          totalPages: page.totalPages,
        }))
      );
  }

  getAllOfferings(
    page: number,
    filterParams?: OfferingFilterParams
  ): Observable<{ currentOfferings: HomeOffering[]; totalPages: number }> {
    let params = this.getHttpParams(filterParams);
    console.log(params);

    params = params.set('page', page);

    return this.httpClient
      .get<Page<HomeOffering>>('http://localhost:8080/api/offerings/', {
        params,
      })
      .pipe(
        map((page) => ({
          currentOfferings: page.content,
          totalPages: page.totalPages,
        }))
      );
  }

  private getHttpParams(filterParams?: OfferingFilterParams): HttpParams {
    let params = new HttpParams();

    if (!filterParams) {
      return params;
    }
    if (filterParams.categoryId) {
      params = params.set('categoryId', filterParams.categoryId);
    }
    if (filterParams.name) {
      params = params.set('name', filterParams.name);
    }
    if (filterParams.eventTypeId) {
      params = params.set('eventTypeId', filterParams.eventTypeId);
    }
    if (filterParams.minPrice) {
      params = params.set('minPrice', filterParams.minPrice);
    }
    if (filterParams.maxPrice) {
      params = params.set('maxPrice', filterParams.maxPrice);
    }
    if (filterParams.description) {
      params = params.set('description', filterParams.description);
    }
    if (filterParams.sortCategory) {
      params = params.set('sortBy', filterParams.sortCategory);
    }
    if (filterParams.sortType) {
      params = params.set('sortDirection', filterParams.sortType);
    }
    return params;
  }
}
