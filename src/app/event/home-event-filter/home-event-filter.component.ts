import { Component, EventEmitter, Output } from '@angular/core';
import { HomeEventFilterParams } from '../model/home-event-filter-param.model';

@Component({
  selector: 'app-home-event-filter',
  templateUrl: './home-event-filter.component.html',
  styleUrl: './home-event-filter.component.scss',
})
export class HomeEventFilterComponent {
  @Output()
  clicked: EventEmitter<HomeEventFilterParams> =
    new EventEmitter<HomeEventFilterParams>();

  filterParams?: HomeEventFilterParams;

  isAvtive: boolean;

  today: Date;

  constructor() {
    this.today = new Date();
    this.isAvtive = false;
    this.filterParams = {
      name: '',
    };
  }

  showEventFilter(): void {
    this.isAvtive = !this.isAvtive;
  }

  searchEvents(): void {
    this.clicked.emit(this.filterParams);
  }
}
