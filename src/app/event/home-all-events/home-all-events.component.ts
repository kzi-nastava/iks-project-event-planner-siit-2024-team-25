import { Component, OnInit } from '@angular/core';
import { HomeEvent } from '../model/home-event.model';
import { DatePipe } from '@angular/common';
import { EventService } from '../service/event.service';
import { HomeEventFilterParams } from '../model/home-event-filter-param.model';

@Component({
  selector: 'app-home-all-events',
  templateUrl: './home-all-events.component.html',
  styleUrl: './home-all-events.component.scss',
  providers: [DatePipe],
})
export class HomeAllEventsComponent implements OnInit {
  currentEvents: HomeEvent[] = [];
  currentPage: number = 0;
  totalPages: number = 1;
  filterParams?: HomeEventFilterParams;

  constructor(private datePipe: DatePipe, private eventService: EventService) {}

  ngOnInit(): void {
    this.getEvents(this.currentPage);
  }

  filterEvents(filterParams: HomeEventFilterParams): void {
    this.filterParams = filterParams;
    this.currentPage = 0;
    this.getEvents(this.currentPage, filterParams);
  }

  private getEvents(
    currentPage: number,
    filterParams?: HomeEventFilterParams
  ): void {
    this.eventService.getEvents(currentPage, this.filterParams).subscribe({
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
    event.isLiked = !event.isLiked;
  }

  getPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getEvents(this.currentPage, this.filterParams);
    }
  }

  getNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getEvents(this.currentPage, this.filterParams);
    }
  }
}
