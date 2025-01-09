import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { HomeEvent } from '../model/home-event.model';
import { EventService } from '../service/event.service';

@Component({
  selector: 'app-favorite-events',
  templateUrl: './favorite-events.component.html',
  styleUrl: './favorite-events.component.scss',
})
export class FavoriteEventsComponent implements OnInit {
  events?: HomeEvent[];
  loading = true;

  constructor(
    private eventService: EventService,
    private toastService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  private fetchEvents() {
    this.eventService.getFavoriteEvents().subscribe({
      next: (events: HomeEvent[]) => {
        this.events = events;
        this.loading = false;
      },
      error: (err: ErrorResponse) => {
        this.loading = false;
        this.toastService.error(
          err.message,
          'Failed to fetch favorite events!',
        );
      },
    });
  }

  removeFromFavorites(event: HomeEvent) {
    this.eventService.removeFromFavorites(event.id).subscribe({
      next: () => {
        this.toastService.success(
          `${event.name} successfully removed from favorites!`,
        );
        this.fetchEvents();
      },
      error: (err: ErrorResponse) => {
        this.toastService.error(
          err.message,
          `Failed to remove ${event.name} from favorite events...`,
        );
      },
    });
  }
}
