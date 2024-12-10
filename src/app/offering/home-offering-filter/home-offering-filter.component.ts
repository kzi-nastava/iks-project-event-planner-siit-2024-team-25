import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OfferingFilterParams } from '../model/home-offering-filter-params-model';
import { EventTypeService } from '../../event/service/event-type.service';
import { EventTypePreviewModel } from '../../event/model/event.type.preview.model';

@Component({
  selector: 'app-home-offering-filter',
  templateUrl: './home-offering-filter.component.html',
  styleUrl: './home-offering-filter.component.scss',
})
export class HomeOfferingFilterComponent implements OnInit {
  constructor(private eventTypeService: EventTypeService) {}
  ngOnInit(): void {
    this.eventTypeService.getAllEventTypes().subscribe({
      next: (eventTypes: EventTypePreviewModel[]) => {
        this.eventTypes = eventTypes;
      },
    });
  }

  @Output()
  clicked: EventEmitter<OfferingFilterParams> =
    new EventEmitter<OfferingFilterParams>();

  filterParams: OfferingFilterParams = {};

  isActive: boolean = false;

  eventTypes: EventTypePreviewModel[] = [];

  today: Date = new Date();
  sortCategories = [
    { label: 'Name', value: 'name' },
    { label: 'Price', value: 'price' },
    { label: 'Country', value: 'owner.companyAddress.country' },
    { label: 'City', value: 'owner.companyAddress.city' },
    { label: 'Discount', value: 'discount' },
  ];

  sortTypes = [
    { label: 'Ascending', value: 'asc' },
    { label: 'Descending', value: 'desc' },
  ];

  criteries = [
    { label: 'All', value: 'ALL' },
    { label: 'Products', value: 'PRODUCTS' },
    { label: 'Services', value: 'SERVICES' },
  ];

  showOfferingFilter(): void {
    this.isActive = !this.isActive;
  }

  searchOfferings(): void {
    this.clicked.emit(this.filterParams);
  }
  refreshEventFilter() {
    this.filterParams = {};
    this.clicked.emit(this.filterParams);
  }
}
