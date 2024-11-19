import { Component, OnInit } from '@angular/core';
import { HomeEvent } from '../model/home-event.model';
import { DatePipe } from '@angular/common';
import { EventService } from '../service/event.service';
import { HomeEventFilterParams } from '../model/home-event-filter-param.model';


@Component({
  selector: 'app-home-all-events',
  templateUrl: './home-all-events.component.html',
  styleUrl: './home-all-events.component.scss',
  providers: [DatePipe]
})
export class HomeAllEventsComponent implements OnInit {

  allEvents: HomeEvent[] = []
  currentPage: number = 1;

  constructor(private datePipe: DatePipe, private eventService: EventService){}

  ngOnInit(): void {
    this.getEvents(this.currentPage);
  }

  filterEvents(filterParams: HomeEventFilterParams): void{
    this.eventService.getFilteredEvents(filterParams).subscribe({
      next: (allEvents: HomeEvent[]) =>{
        this.allEvents = allEvents;
      }
    })
  }

  private getEvents(currentPage: number){
    this.eventService.getEvents(currentPage).subscribe({
      next: (allEvents: HomeEvent[]) =>{
        this.allEvents = allEvents;
      }
    })
  }

  toggleFavouriteEvent(event: HomeEvent): void {
    event.isLiked = !event.isLiked;
  }

  getNextPage(){
    this.currentPage++;
    this.getEvents(this.currentPage);
  }

  getPreviousPage(){
    if(this.currentPage>1){
      this.currentPage--;
      this.getEvents(this.currentPage);
    }
  }
}
