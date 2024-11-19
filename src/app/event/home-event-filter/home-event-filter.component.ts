import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HomeEventFilterParams } from '../model/home-event-filter-param.model';

@Component({
  selector: 'app-home-event-filter',
  templateUrl: './home-event-filter.component.html',
  styleUrl: './home-event-filter.component.scss',
})
export class HomeEventFilterComponent implements OnInit {
  @Output()
  clicked: EventEmitter<HomeEventFilterParams> =
    new EventEmitter<HomeEventFilterParams>();

  filterParams?: HomeEventFilterParams;

  isAvtive!: boolean;

  today!: Date;

  sortCategories!: string[];
  sortTypes!: string[];

  ngOnInit(): void {
    this.today = new Date();
    this.isAvtive = false;
    this.filterParams = {
      name: '',
    };

    this.sortCategories = ['', 'Name', 'Start date', 'Country'];
    this.sortTypes = ['', 'ACS', 'DESC'];
  }

  showEventFilter(): void {
    this.isAvtive = !this.isAvtive;
  }

  searchEvents(): void {
    this.clicked.emit(this.filterParams);
  }
}
