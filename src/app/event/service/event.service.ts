import { Injectable } from '@angular/core';
import { HomeEvent } from '../model/home-event.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private currentEvents: HomeEvent[] = [];

  constructor() { }

  getEvents(): Observable<HomeEvent[]> {
    this.currentEvents = [
      {
        id: 1,
        name: 'Music Concert',
        date: new Date('2024-12-01'),
        city: "Uzice",
        description: 'A great music concert with various artists.',
        organizerName: 'Stefan',
        isLiked: false,
      },
      {
        id: 2,
        name: 'Art Exhibition',
        date: new Date('2024-12-05'),
        city: "Uzice",
        description: 'An exhibition showcasing modern art.',
        organizerName: 'Stefan',
        isLiked: false,
      },
      {
        id: 3,
        name: 'Tech Conference',
        date: new Date('2024-12-10'),
        city: "Uzice",
        organizerName: 'Stefan',
        description: 'A conference for tech enthusiasts and developers.',
        isLiked: false,
      },
      {
        id: 4,
        name: 'Cooking Class',
        date: new Date('2024-12-15'),
        city: "Uzice",
        organizerName: 'Stefan',
        description: 'Learn to cook traditional Italian dishes.',
        isLiked: false,
      },
      {
        id: 5,
        name: 'Sports Tournament',
        date: new Date('2024-12-20'),
        city: "Uzice",
        organizerName: 'Stefan',
        description: 'A tournament featuring various sports competitions.',
        isLiked: false,
      }
    ];
    return of(this.currentEvents);
  }

  // Metoda za menjanje stanja isLiked
  toggleFavouriteEvents(eventId: number): void {
    const event = this.currentEvents.find(e => e.id === eventId);
    if (event) {
      event.isLiked = !event.isLiked; 
    }
  }
}
