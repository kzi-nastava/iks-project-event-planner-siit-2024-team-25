import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EventService } from '../service/event.service';
import { HomeEvent } from '../model/home-event.model';

@Component({
  selector: 'app-home-top-events',
  templateUrl: './home-top-events.component.html',
  styleUrl: './home-top-events.component.scss',
  providers: [DatePipe],
})
export class HomeTopEventsComponent implements OnInit {
  topEvents: HomeEvent[] = [];

  constructor(private eventService: EventService, private datePipe: DatePipe) {}

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
    event.isLiked = !event.isLiked;
  }
}
