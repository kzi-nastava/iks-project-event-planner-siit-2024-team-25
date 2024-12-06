import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HomeEventFilterParams } from '../model/home.event.filter.param.model';
import { EventTypeService } from '../service/event-type.service';
import { EventTypePreviewModel } from '../model/event.type.preview.model';

@Component({
  selector: 'app-home-event-filter',
  templateUrl: './home-event-filter.component.html',
  styleUrl: './home-event-filter.component.scss',
})
export class HomeEventFilterComponent implements OnInit {
  constructor(private eventTypeService: EventTypeService) {}

  @Output()
  clicked: EventEmitter<HomeEventFilterParams> =
    new EventEmitter<HomeEventFilterParams>();

  filterParams?: HomeEventFilterParams;

  isAvtive!: boolean;

  today!: Date;

  sortByMap?: Map<string, string>;
  sortDirectionsMap?: Map<string, string>;
  sortBy: { display: string; value: string }[] = [];
  sortDirection: { display: string; value: string }[] = [];
  eventTypes?: EventTypePreviewModel[] = [];

  ngOnInit(): void {
    this.eventTypeService.getAllEventTypes().subscribe({
      next: (eventTypes: EventTypePreviewModel[]) => {
        this.eventTypes = eventTypes;
      },
    });

    this.today = new Date();
    this.isAvtive = false;
    this.filterParams = {};

    this.sortByMap = new Map([
      ['', ''],
      ['Name', 'name'],
      ['Start Date', 'startDate'],
      ['Organizer', 'organizer.firstName'],
      ['Country', 'location.country'],
      ['City', 'location.city'],
    ]);

    this.sortDirectionsMap = new Map([
      ['', ''],
      ['Ascending', 'asc'],
      ['Descending', 'desc'],
    ]);

    this.sortBy = Array.from(this.sortByMap.entries()).map(
      ([display, value]) => ({
        display,
        value,
      })
    );

    this.sortDirection = Array.from(this.sortDirectionsMap.entries()).map(
      ([display, value]) => ({
        display,
        value,
      })
    );
  }

  showEventFilter(): void {
    this.isAvtive = !this.isAvtive;
  }

  searchEvents(): void {
    this.clicked.emit(this.filterParams);
  }

  refreshEventFilter() {
    this.filterParams = {};
    this.clicked.emit(this.filterParams);
  }
}
