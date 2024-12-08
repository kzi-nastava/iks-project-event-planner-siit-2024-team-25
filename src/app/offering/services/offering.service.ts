import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { AddressService } from '../../infrastructure/location/address.service';
import { Location } from '../../infrastructure/location/location.model';
import { Page } from '../../shared/model/page.mode';
import { OfferingFilterParams } from '../model/home-offering-filter-params-model';
import { HomeOffering } from '../model/home-offering.model';

@Injectable({
  providedIn: 'root',
})
export class OfferingService {
  constructor(
    private httpClient: HttpClient,
    private locationService: AddressService,
  ) {}

  getTopOfferings(): Observable<HomeOffering[]> {
    return this.locationService.address$.pipe(
      switchMap((address: Location | null) => {
        let params = new HttpParams();

        if (address) {
          params = params.set('country', address.country ?? '');
          params = params.set('city', address.city ?? '');
        }

        return this.httpClient
          .get<Page<HomeOffering>>('http://localhost:8080/api/offerings/top', {
            params,
          })
          .pipe(map((page) => page.content));
      }),
    );
  }

  getOfferings(
    page: number,
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
        })),
      );
  }

  getFilteredOfferings(
    filterParams: OfferingFilterParams,
  ): Observable<HomeOffering[]> {
    return this.httpClient
      .get<Page<HomeOffering>>('http://localhost:8080/api/offerings/')
      .pipe(map((page) => page.content));
  }
}
