import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HomeEvent } from '../model/home-event.model';

@Component({
  selector: 'app-home-event-card',
  templateUrl: './home-event-card.component.html',
  styleUrl: './home-event-card.component.scss'
})
export class HomeEventCardComponent {

  @Input()
  event!: HomeEvent
  
  @Output()
  clicked: EventEmitter<HomeEvent> = new EventEmitter<HomeEvent>();

  changeFavouriteEvent(): void {
    this.clicked.emit(this.event);
  }

  constructor(private datePipe: DatePipe){}
  
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy') || ''; 
  }

  formatLocation(country: string, city: string){
    return country + "," + city
  }


}
