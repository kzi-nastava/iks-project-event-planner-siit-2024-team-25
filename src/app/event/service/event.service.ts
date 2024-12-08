import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { AddressService } from '../../infrastructure/location/address.service';
import { Location } from '../../infrastructure/location/location.model';
import { Page } from '../../shared/model/page.mode';
import { HomeEventFilterParams } from '../model/home-event-filter-param.model';
import { HomeEvent } from '../model/home-event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private httpClient: HttpClient,
    private locationService: AddressService,
  ) {}

  private allEvents: HomeEvent[] = [
    {
      id: 1,
      name: 'Music Concert',
      startDateTime: '2024-12-01T19:00',
      city: 'Uzice',
      description: 'A great music concert with various artists.',
      organizerName: 'Stefan',
      isLiked: false,
      country: 'Republika Srbija',
    },
    {
      id: 2,
      name: 'Art Exhibition',
      startDateTime: '2024-12-05T10:30',
      city: 'Uzice',
      description: 'An exhibition showcasing modern art.',
      organizerName: 'Stefan',
      isLiked: false,
      country: 'Republika Srbija',
    },
    {
      id: 3,
      name: 'Tech Conference',
      startDateTime: '2024-12-10T09:00',
      city: 'Uzice',
      description: 'A conference for tech enthusiasts and developers.',
      organizerName: 'Stefan',
      isLiked: false,
      country: 'Republika Srbija',
    },
    {
      id: 4,
      name: 'Cooking Class',
      startDateTime: '2024-12-15T16:45',
      city: 'Uzice',
      description: 'Learn to cook traditional Italian dishes.',
      organizerName: 'Stefan',
      isLiked: false,
      country: 'Republika Srbija',
    },
    {
      id: 5,
      name: 'Sports Tournament',
      startDateTime: '2024-12-20T14:00',
      city: 'Uzice',
      description: 'A tournament featuring various sports competitions.',
      organizerName: 'Stefan',
      isLiked: false,
      country: 'Republika Srbija',
    },
    {
      id: 6,
      name: 'Dance Workshop',
      startDateTime: '2024-12-22T18:30',
      city: 'Uzice',
      description: 'A workshop to learn modern dance styles.',
      organizerName: 'Stefan',
      isLiked: false,
      country: 'Republika Srbija',
    },
    {
      id: 7,
      name: 'Book Fair',
      startDateTime: '2024-12-25T10:00',
      city: 'Uzice',
      description: 'A fair with books from various publishers and authors.',
      organizerName: 'Stefan',
      isLiked: false,
      country: 'Republika Srbija',
    },
    {
      id: 8,
      name: 'Film Festival',
      startDateTime: '2024-12-27T20:00',
      city: 'Uzice',
      description:
        'A festival featuring award-winning films and documentaries.',
      organizerName: 'Stefan',
      isLiked: false,
      country: 'Republika Srbija',
    },
    {
      id: 9,
      name: 'Yoga Retreat',
      startDateTime: '2024-12-29T07:30',
      city: 'Uzice',
      description: 'A peaceful retreat focused on yoga and mindfulness.',
      organizerName: 'Stefan',
      isLiked: false,
      country: 'Republika Srbija',
    },
    {
      id: 10,
      name: 'Holiday Market',
      startDateTime: '2024-12-31T15:00',
      city: 'Uzice',
      description: 'A market filled with holiday gifts, crafts, and food.',
      organizerName: 'Stefan',
      isLiked: false,
      country: 'Republika Srbija',
    },
  ];

  getFilteredEvents(filterParams: HomeEventFilterParams) {
    return of(
      this.allEvents.filter((o) => {
        if (filterParams.name) {
          return o.name.includes(filterParams.name);
        }
        return true;
      }),
    );
  }

  getTopEvents(): Observable<HomeEvent[]> {
    return this.locationService.address$.pipe(
      switchMap((address: Location | null) => {
        let params = new HttpParams();

        if (address) {
          params = params.set('country', address.country ?? '');
          params = params.set('city', address.city ?? '');
        }

        return this.httpClient
          .get<
            Page<HomeEvent>
          >('http://localhost:8080/api/events/top', { params })
          .pipe(map((page) => page.content));
      }),
    );
  }

  getEvents(
    page: number,
  ): Observable<{ currentEvents: HomeEvent[]; totalPages: number }> {
    let params = new HttpParams();

    params = params.set('page', page);

    return this.httpClient
      .get<Page<HomeEvent>>('http://localhost:8080/api/events/all', { params })
      .pipe(
        map((page) => ({
          currentEvents: page.content,
          totalPages: page.totalPages,
        })),
      );
  }
}
