import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HomeEvent } from '../model/home-event.model';

@Component({
  selector: 'app-favorite-event-card',
  templateUrl: './favorite-event-card.component.html',
  styleUrl: './favorite-event-card.component.scss',
})
export class FavoriteEventCardComponent {
  @Input()
  event!: HomeEvent;

  @Output()
  clicked: EventEmitter<HomeEvent> = new EventEmitter<HomeEvent>();

  removeFavorite(): void {
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
