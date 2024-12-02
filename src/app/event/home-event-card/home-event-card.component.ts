import { DatePipe, Time } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HomeEvent } from '../model/home-event.model';

@Component({
  selector: 'app-home-event-card',
  templateUrl: './home-event-card.component.html',
  styleUrl: './home-event-card.component.scss',
})
export class HomeEventCardComponent {
  @Input()
  event!: HomeEvent;

  @Output()
  clicked: EventEmitter<HomeEvent> = new EventEmitter<HomeEvent>();

  changeFavouriteEvent(): void {
    this.clicked.emit(this.event);
  }

  constructor(private datePipe: DatePipe) {}

  formatDateTime(date: string): string {
    const dateObj = new Date(date);
    return this.datePipe.transform(dateObj, 'yyyy-MM-dd HH:mm') || '';
  }

  formatLocation(country: string, city: string) {
    return country + ',' + city;
  }
}
