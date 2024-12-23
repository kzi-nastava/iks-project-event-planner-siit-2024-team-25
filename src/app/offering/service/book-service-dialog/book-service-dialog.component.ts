import { Component, OnInit } from '@angular/core';
import { PurchaseRequest } from '../../model/purchase.request.model';
import { Service } from '../model/service';
import { Event } from '../../../event/model/event.model';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../event/service/event.service';
import { OfferingServiceService } from '../offering-service.service';

@Component({
  selector: 'app-book-service-dialog',
  templateUrl: './book-service-dialog.component.html',
  styleUrl: './book-service-dialog.component.scss',
})
export class BookServiceDialogComponent implements OnInit {
  purchase: PurchaseRequest = {};
  service!: Service;
  event!: Event;
  errorMessage: string | null = null;
  maxEndTime!: string;
  minEndTime!: string;
  eventStartTime!: string;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private serviceService: OfferingServiceService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (+params['id']) {
        this.serviceService.getServiceById(+params['id']).subscribe({
          next: (service: Service) => {
            this.service = service;
          },
        });
      }
    });

    this.route.queryParams.subscribe((queryParams) => {
      if (+queryParams['eventId']) {
        this.eventService.getEvent(+queryParams['eventId']).subscribe({
          next: (event: Event) => {
            this.event = event;
            this.purchase.startDate = event.startDate;
            this.purchase.endDate = event.startDate;

            this.setMinStartTime();
          },
        });
      }
    });
  }

  onStartTimeChange(): void {
    if (this.purchase.startDate && this.purchase.startTime) {
    }
    if (
      this.purchase.startDate &&
      this.purchase.startTime &&
      this.service.duration
    ) {
      this.errorMessage = null;

      const [hours, minutes] = this.purchase.startTime.split(':').map(Number);
      const startDateTime = new Date(this.purchase.startDate);
      startDateTime.setHours(hours, minutes, 0, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + this.service.duration);

      this.purchase.endDate = endDateTime;
      this.purchase.endTime = `${this.padZero(
        endDateTime.getHours()
      )}:${this.padZero(endDateTime.getMinutes())}`;
    } else if (this.purchase.startDate && this.purchase.startTime) {
      this.purchase.endTime = undefined;
      const [hours, minutes] = this.purchase.startTime.split(':').map(Number);
      const startDateTime = new Date(this.purchase.startDate);
      startDateTime.setHours(hours, minutes, 0, 0);

      const minEndDateTime = new Date(startDateTime);
      minEndDateTime.setHours(
        minEndDateTime.getHours() + this.service.minimumArrangement
      );

      this.minEndTime = `${this.padZero(
        minEndDateTime.getHours()
      )}:${this.padZero(minEndDateTime.getMinutes())}`;

      const maxEndDateTime = new Date(startDateTime);
      maxEndDateTime.setHours(
        maxEndDateTime.getHours() + this.service.maximumArrangement
      );

      this.maxEndTime = `${this.padZero(
        maxEndDateTime.getHours()
      )}:${this.padZero(maxEndDateTime.getMinutes())}`;
    }
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  onEndTimeChange(): void {
    if (
      this.purchase.startDate &&
      this.purchase.startTime &&
      this.purchase.endDate &&
      this.purchase.endTime
    ) {
      const [hours, minutes] = this.purchase.startTime.split(':').map(Number);
      const startDateTime = new Date(this.purchase.startDate);
      startDateTime.setHours(hours, minutes, 0, 0);

      const [endHours, endMinutes] = this.purchase.endTime
        .split(':')
        .map(Number);
      const endDateTime = new Date(this.purchase.endDate);
      startDateTime.setHours(endHours, endMinutes, 0, 0);

      const differenceInMinutes =
        (endDateTime.getTime() - startDateTime.getTime()) / 60000;

      const minArrangementMinutes = this.service.minimumArrangement * 60;
      const maxArrangementMinutes = this.service.maximumArrangement * 60;

      if (
        differenceInMinutes < minArrangementMinutes ||
        differenceInMinutes > maxArrangementMinutes
      ) {
        this.errorMessage = `The selected duration is outside the allowed range of ${this.service.minimumArrangement} to ${this.service.maximumArrangement} hours.`;
      } else {
        this.errorMessage = null;
      }
    }
  }

  setMinStartTime(): void {
    const [hours, minutes] = this.event.startTime.split(':').map(Number);

    const minStartTime = new Date(this.event.startDate);
    minStartTime.setHours(hours, minutes, 0, 0);

    this.eventStartTime = `${this.padZero(
      minStartTime.getHours()
    )}:${this.padZero(minStartTime.getMinutes())}`;
  }
}
