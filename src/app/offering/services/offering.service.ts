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
    page: number
  ): Observable<{ currentOfferings: HomeOffering[]; totalPages: number }> {
    let params = new HttpParams();

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

  getFilteredOfferings(
    filterParams: OfferingFilterParams
  ): Observable<HomeOffering[]> {
    return this.httpClient
      .get<Page<HomeOffering>>('http://localhost:8080/api/offerings/')
      .pipe(map((page) => page.content));
  }
}
