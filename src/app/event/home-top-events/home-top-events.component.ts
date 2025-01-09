import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { HomeEvent } from '../model/home-event.model';
import { EventService } from '../service/event.service';

@Component({
  selector: 'app-home-top-events',
  templateUrl: './home-top-events.component.html',
  styleUrl: './home-top-events.component.scss',
  providers: [DatePipe],
})
export class HomeTopEventsComponent implements OnInit {
  topEvents: HomeEvent[] = [];

  constructor(
    private eventService: EventService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.eventService.getTopEvents().subscribe({
      next: (topEvents: HomeEvent[]) => {
        this.topEvents = topEvents;
        console.log(this.topEvents);
      },
      error: (err) => {
        console.error('Error fetching top events:', err);
      },
    });
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
  }

  toggleFavouriteEvent(event: HomeEvent): void {
    if (event.isFavorite) {
      this.eventService.removeFromFavorites(event.id).subscribe({
        next: () => {
          event.isFavorite = false;
        },
        error: (err: ErrorResponse) => {
          console.error('Error adding event to favorites:', err);
        },
      });
    } else {
      this.eventService.addToFavorites(event.id).subscribe({
        next: () => {
          event.isFavorite = true;
        },
        error: (err: ErrorResponse) => {
          console.error('Error removing event from favorites:', err);
        },
      });
    }
  }
}
