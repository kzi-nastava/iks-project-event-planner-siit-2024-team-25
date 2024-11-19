import { Component, EventEmitter, Output } from '@angular/core';
import { OfferingFilterParams } from '../model/home-offering-filter-params-model';

@Component({
  selector: 'app-home-offering-filter',
  templateUrl: './home-offering-filter.component.html',
  styleUrl: './home-offering-filter.component.scss',
})
export class HomeOfferingFilterComponent {
  @Output()
  clicked: EventEmitter<OfferingFilterParams> =
    new EventEmitter<OfferingFilterParams>();

  filterParams?: OfferingFilterParams;

  isAvtive: boolean;

  today: Date;
  sortCategories: string[];
  sortTypes: string[];

  constructor() {
    this.today = new Date();
    this.isAvtive = false;
    this.filterParams = {
      name: '',
    };

    this.sortCategories = ['', 'Name', 'Start date', 'Country'];
    this.sortTypes = ['', 'ACS', 'DESC'];
  }

  showOfferingFilter(): void {
    this.isAvtive = !this.isAvtive;
  }

  searchOfferings(): void {
    this.clicked.emit(this.filterParams);
  }
}
