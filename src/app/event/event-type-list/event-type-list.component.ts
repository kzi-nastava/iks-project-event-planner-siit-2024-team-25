import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

import { EventType } from '../model/event.type.model';
import { EventTypeService } from '../service/event-type.service';

@Component({
  selector: 'app-event-type-list',
  templateUrl: './event-type-list.component.html',
  styleUrl: './event-type-list.component.scss',
})
export class EventTypeListComponent implements OnInit {
  public eventTypes$!: Observable<EventType[]>;
  public dataSource = new MatTableDataSource<EventType>();
  public displayedColumns: string[] = ['name', 'description', 'actions'];

  constructor(private eventTypeService: EventTypeService) {}

  ngOnInit(): void {
    this.eventTypes$ = this.eventTypeService.getEventTypes();
    this.eventTypes$.subscribe((types) => {
      this.dataSource.data = types;
    });
  }
}
