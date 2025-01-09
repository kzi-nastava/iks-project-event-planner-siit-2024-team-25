import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HomeEvent } from '../model/home-event.model';
import { HomeEventFilterParams } from '../model/home.event.filter.param.model';
import { EventService } from '../service/event.service';

@Component({
  selector: 'app-home-all-events',
  templateUrl: './home-all-events.component.html',
  styleUrl: './home-all-events.component.scss',
  providers: [DatePipe],
})
export class HomeAllEventsComponent implements OnInit {
  currentEvents: HomeEvent[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  filterParams?: HomeEventFilterParams;

  constructor(
    private datePipe: DatePipe,
    private eventService: EventService,
  ) {}

  ngOnInit(): void {
    this.getEvents();
  }

  filterEvents(filterParams: HomeEventFilterParams): void {
    this.filterParams = filterParams;
    this.currentPage = 1;
    this.getEvents();
  }

  private getEvents(): void {
    this.eventService
      .getEvents(this.currentPage - 1, this.filterParams)
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
    event.isFavorite = !event.isFavorite;
  }

  getPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getEvents();
    }
  }

  getNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getEvents();
    }
  }
}
