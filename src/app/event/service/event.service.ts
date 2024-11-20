import { Injectable } from '@angular/core';
import { HomeEvent } from '../model/home-event.model';
import { Observable, of } from 'rxjs';
import { HomeEventFilterParams } from '../model/home-event-filter-param.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {



  constructor() { }

  private topEvents: HomeEvent[] = [
    {
      id: 1,
      name: 'Music Concert',
      date: new Date('2024-12-01'),
      city: "Uzice",
      description: 'A great music concert with various artists.',
      organizerName: 'Stefan',
      isLiked: false,
      country: "Republika Srbija"
    },
    {
      id: 2,
      name: 'Art Exhibition',
      date: new Date('2024-12-05'),
      city: "Uzice",
      description: 'An exhibition showcasing modern art.',
      organizerName: 'Stefan',
      isLiked: false,
      country: "Republika Srbija"
    },
    {
      id: 3,
      name: 'Tech Conference',
      date: new Date('2024-12-10'),
      city: "Uzice",
      organizerName: 'Stefan',
      description: 'A conference for tech enthusiasts and developers.',
      isLiked: false,
      country: "Republika Srbija"
    },
    {
      id: 4,
      name: 'Cooking Class',
      date: new Date('2024-12-15'),
      city: "Uzice",
      organizerName: 'Stefan',
      description: 'Learn to cook traditional Italian dishes.',
      isLiked: false,
      country: "Republika Srbija"
    },
    {
      id: 5,
      name: 'Sports Tournament',
      date: new Date('2024-12-20'),
      city: "Uzice",
      organizerName: 'Stefan',
      description: 'A tournament featuring various sports competitions.',
      isLiked: false,
      country: "Republika Srbija"
    }
  ];

  private allEvents: HomeEvent[] = [
    {
      id: 1,
      name: 'Music Concert',
      date: new Date('2024-12-01'),
      city: "Uzice",
      description: 'A great music concert with various artists.',
      organizerName: 'Stefan',
      isLiked: false,
      country: "Republika Srbija"
    },
    {
      id: 2,
      name: 'Art Exhibition',
      date: new Date('2024-12-05'),
      city: "Uzice",
      description: 'An exhibition showcasing modern art.',
      organizerName: 'Stefan',
      isLiked: false,
      country: "Republika Srbija"
    },
    {
      id: 3,
      name: 'Tech Conference',
      date: new Date('2024-12-10'),
      city: "Uzice",
      organizerName: 'Stefan',
      description: 'A conference for tech enthusiasts and developers.',
      isLiked: false,
      country: "Republika Srbija"
    },
    {
      id: 4,
      name: 'Cooking Class',
      date: new Date('2024-12-15'),
      city: "Uzice",
      description: 'Learn to cook traditional Italian dishes.',
      organizerName: 'Stefan',
      isLiked: false,
      country: "Republika Srbija"
    },
    {
      id: 5,
      name: 'Sports Tournament',
      date: new Date('2024-12-20'),
      city: "Uzice",
      organizerName: 'Stefan',
      description: 'A tournament featuring various sports competitions.',
      isLiked: false,
      country: "Republika Srbija"
    },
    {
      id: 6,
      name: 'Dance Workshop',
      date: new Date('2024-12-22'),
      city: "Uzice",
      description: 'A workshop to learn modern dance styles.',
      organizerName: 'Stefan',
      isLiked: false,
      country: "Republika Srbija"
    },
    {
      id: 7,
      name: 'Book Fair',
      date: new Date('2024-12-25'),
      city: "Uzice",
      description: 'A fair with books from various publishers and authors.',
      organizerName: 'Stefan',
      isLiked: false,
      country: "Republika Srbija"
    },
    {
      id: 8,
      name: 'Film Festival',
      date: new Date('2024-12-27'),
      city: "Uzice",
      description: 'A festival featuring award-winning films and documentaries.',
      organizerName: 'Stefan',
      isLiked: false,
      country: "Republika Srbija"
    },
    {
      id: 9,
      name: 'Yoga Retreat',
      date: new Date('2024-12-29'),
      city: "Uzice",
      description: 'A peaceful retreat focused on yoga and mindfulness.',
      organizerName: 'Stefan',
      isLiked: false,
      country: "Republika Srbija"
    },
    {
      id: 10,
      name: 'Holiday Market',
      date: new Date('2024-12-31'),
      city: "Uzice",
      description: 'A market filled with holiday gifts, crafts, and food.',
      organizerName: 'Stefan',
      isLiked: false,
      country: "Republika Srbija"
    }
  ];

  getFilteredEvents(filterParams: HomeEventFilterParams) {
    return of(this.allEvents.filter(o =>{
      if(filterParams.name){
        return o.name.includes(filterParams.name);
      }
      return true;
    }));
  }

  getTopEvents(): Observable<HomeEvent[]> {
    return of(this.topEvents);
  }

  getEvents(page: number): Observable<HomeEvent[]> {
    return of(this.allEvents);
  }
}
