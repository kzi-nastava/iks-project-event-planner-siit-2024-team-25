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

  private currentOfferings: HomeOffering[] = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
    {
      id: 6,
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
      id: 7,
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
      id: 8,
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
      id: 9,
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
      id: 10,
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
    const user = this.authService.getUser(); // Dohvati trenutnog korisnika

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

  getOfferings(page: number) {
    return of(this.currentOfferings);
  }

  getFilteredOfferings(
    filterParams: OfferingFilterParams
  ): Observable<HomeOffering[]> {
    console.log(JSON.stringify(filterParams));
    return of(
      this.currentOfferings.filter((o) => {
        if (filterParams.name) {
          return o.name.includes(filterParams.name);
        }
        return true;
      })
    );
  }
}
