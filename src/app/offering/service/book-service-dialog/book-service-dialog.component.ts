import { Component, OnInit } from '@angular/core';
import { PurchaseRequest } from '../../model/purchase.request.model';
import { Service } from '../model/service';
import { Event } from '../../../event/model/event.model';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../event/service/event.service';
import { OfferingServiceService } from '../offering-service.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorResponse } from '../../../shared/model/error.response.model';

@Component({
  selector: 'app-book-service-dialog',
  templateUrl: './book-service-dialog.component.html',
  styleUrl: './book-service-dialog.component.scss',
})
export class BookServiceDialogComponent implements OnInit {
  purchase: PurchaseRequest = {};
  service!: Service;
  event!: Event;
  errorMessage?: string;
  maxEndTime!: string;
  minEndTime!: string;
  eventStartTime!: string;
  isAvailable!: boolean;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private serviceService: OfferingServiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (+params['id']) {
        this.serviceService.getServiceById(+params['id']).subscribe({
          next: (service: Service) => {
            this.service = service;
            console.log(service);
            this.purchase.price =
              (service.price * (100 - service.discount)) / 100;
          },
        });
      }
    });

    this.route.queryParams.subscribe((queryParams) => {
      if (+queryParams['eventId']) {
        this.eventService.getEvent(+queryParams['eventId']).subscribe({
          next: (event: Event) => {
            console.log(event);
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
      this.errorMessage = undefined;

      const [hours, minutes] = this.purchase.startTime.split(':').map(Number);
      const startDateTime = new Date(this.purchase.startDate);
      startDateTime.setHours(hours, minutes, 0, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + this.service.duration);

      this.purchase.endDate = endDateTime;
      this.purchase.endTime = `${this.padZero(
        endDateTime.getHours()
      )}:${this.padZero(endDateTime.getMinutes())}`;
      this.isServiceAvailable();
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
        this.errorMessage = undefined;
      }
      this.isServiceAvailable();
    }
  }
  isServiceAvailable() {
    this.serviceService
      .isServiceAvailable(this.service.id, this.purchase)
      .subscribe({
        next: (available: boolean) => {
          this.isAvailable = available;
        },
      });
  }

  setMinStartTime(): void {
    const [hours, minutes] = this.event.startTime.split(':').map(Number);

    const minStartTime = new Date(this.event.startDate);
    minStartTime.setHours(hours, minutes, 0, 0);

    this.eventStartTime = `${this.padZero(
      minStartTime.getHours()
    )}:${this.padZero(minStartTime.getMinutes())}`;
  }

  bookService() {
    this.serviceService
      .bookService(this.event.id, this.service.id, this.purchase)
      .subscribe({
        next: (successful: boolean) => {
          if (successful) {
            this.toastr.success(
              "You've successfully booked this service for your event!",
              'Success'
            );
            this.isAvailable = false;
          }
        },
        error: (err: ErrorResponse) => {
          if (this.isAvailable) {
            this.toastr.error(err.message, 'Oops!');
          } else {
            this.toastr.error(this.errorMessage, 'Oops!');
          }
        },
      });
  }
}
