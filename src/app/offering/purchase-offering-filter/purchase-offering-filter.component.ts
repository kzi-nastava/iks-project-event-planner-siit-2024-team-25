import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventTypeService } from '../../event/service/event-type.service';
import { OfferingFilterParams } from '../model/home-offering-filter-params-model';
import { EventType } from '../../event/model/event.type.model';
import { OfferingCategory } from '../../event/model/offering-category.model';

@Component({
  selector: 'app-purchase-offering-filter',
  templateUrl: './purchase-offering-filter.component.html',
  styleUrl: './purchase-offering-filter.component.scss',
})
export class PurchaseOfferingFilterComponent implements OnInit {
  @Input()
  filterCriteria!: string;

  @Input()
  eventId!: number;

  eventTypes!: EventType;
  offeringCategories!: OfferingCategory[];

  constructor(private eventTypeService: EventTypeService) {}

  ngOnInit(): void {
    if (this.filterCriteria == 'P') {
      this.filterParams.criteria = this.criteries.at(0)?.value;
    } else {
      this.filterParams.criteria = this.criteries.at(1)?.value;
    }

    this.eventTypeService.getEventTypeByEvent(this.eventId).subscribe({
      next: (eventType: EventType) => {
        this.filterParams.eventTypeId = eventType.id;
        this.eventTypes = eventType;
        this.offeringCategories = eventType.categories;
        this.searchOfferings();
      },
    });
  }

  @Output()
  clicked: EventEmitter<OfferingFilterParams> =
    new EventEmitter<OfferingFilterParams>();

  filterParams: OfferingFilterParams = {};

  isActive: boolean = false;
  numColumns: number = 3;

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
  updateColumns() {
    if (this.filterParams.criteria === 'SERVICES') {
      this.numColumns = 5;
    } else if (this.filterParams.criteria !== 'SERVICES') {
      this.numColumns = 3;
    }
  }
}
