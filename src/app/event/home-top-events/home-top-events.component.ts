import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EventService } from '../service/event.service';
import { HomeEvent } from '../model/home-event.model';

@Component({
  selector: 'app-home-top-events',
  templateUrl: './home-top-events.component.html',
  styleUrl: './home-top-events.component.scss',
  providers: [DatePipe]
})
export class HomeTopEventsComponent implements OnInit {
  

  topEvents: HomeEvent[] = [];

  constructor(private eventService: EventService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe((data) => {
      this.topEvents = data; 
    });
  }


  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy') || ''; 
  }

  toggleFavouriteEvent(eventId: number): void {
    this.eventService.toggleFavouriteEvents(eventId);
  }

}
