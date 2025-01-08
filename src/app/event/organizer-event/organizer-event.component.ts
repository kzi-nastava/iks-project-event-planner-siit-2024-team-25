import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { HomeEvent } from '../model/home-event.model';
import { HomeEventFilterParams } from '../model/home.event.filter.param.model';
import { EventService } from '../service/event.service';

@Component({
  selector: 'app-organizer-event',
  templateUrl: './organizer-event.component.html',
  styleUrl: './organizer-event.component.scss',
  providers: [DatePipe],
})
export class OrganizerEventComponent implements OnInit {
  currentEvents: HomeEvent[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  filterParams?: HomeEventFilterParams;

  constructor(
    private datePipe: DatePipe,
    private eventService: EventService,
  ) {}

  ngOnInit(): void {
    this.getMyEvents();
  }

  filterEvents(filterParams: HomeEventFilterParams): void {
    this.filterParams = filterParams;
    this.currentPage = 1;
    this.getMyEvents();
  }

  private getMyEvents(): void {
    this.eventService
      .getMyEvents(this.currentPage - 1, this.filterParams)
      .subscribe({
        next: ({ currentEvents, totalPages }) => {
          this.currentEvents = currentEvents;
          this.totalPages = totalPages;
        },
        error: (err) => {
          console.error('Error fetching events:', err);
        },
      });
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

  getPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getMyEvents();
    }
  }

  getNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getMyEvents();
    }
  }
}
