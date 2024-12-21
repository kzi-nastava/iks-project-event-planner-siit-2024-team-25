import { Component, OnInit } from '@angular/core';
import { HomeEvent } from '../model/home-event.model';
import { HomeEventFilterParams } from '../model/home.event.filter.param.model';
import { DatePipe, Time } from '@angular/common';
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

  constructor(private datePipe: DatePipe, private eventService: EventService) {}

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
          console.log(currentEvents);
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
