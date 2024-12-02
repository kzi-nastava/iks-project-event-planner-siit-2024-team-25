import { Injectable } from '@angular/core';
import { HomeOffering } from '../model/home-offering.model';
import { map, Observable, of } from 'rxjs';
import { OfferingFilterParams } from '../model/home-offering-filter-params-model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../shared/model/page.mode';

@Injectable({
  providedIn: 'root',
})
export class OfferingService {
  constructor(private httpClient: HttpClient) {}

  private currentTopOfferings: HomeOffering[] = [
    {
      id: 11,
      name: 'Event Photography',
      city: 'Uzice',
      ownerName: 'Stefan',
      isFavourite: false,
      price: 1500,
      description:
        'Professional photography services for events, capturing memorable moments.',
      rating: 5.0,
      country: 'Republika Srbija',
    },
    {
      id: 12,
      name: 'Party Decorations',
      city: 'Uzice',
      ownerName: 'Stefan',
      isFavourite: false,
      price: 800,
      description:
        'Custom event decorations to match the theme of your celebration.',
      rating: 5.0,
      country: 'Republika Srbija',
    },
    {
      id: 13,
      name: 'Live Band Performance',
      city: 'Uzice',
      ownerName: 'Stefan',
      isFavourite: false,
      price: 3000,
      description:
        'Live band performances for weddings, corporate events, and parties.',
      rating: 5.0,
      country: 'Republika Srbija',
    },
    {
      id: 14,
      name: 'Wedding Catering',
      city: 'Uzice',
      ownerName: 'Stefan',
      isFavourite: false,
      price: 2500,
      description:
        'Complete catering service for weddings, including a variety of dishes and drinks.',
      rating: 5.0,
      country: 'Republika Srbija',
    },
    {
      id: 15,
      name: 'Transportation Services',
      city: 'Uzice',
      ownerName: 'Stefan',
      isFavourite: false,
      price: 1000,
      description:
        'Transportation services for guests, including shuttle buses and luxury cars.',
      rating: 5.0,
      country: 'Republika Srbija',
    },
  ];

  getTopOfferings(): Observable<HomeOffering[]> {
    return of(this.currentTopOfferings);
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
}
