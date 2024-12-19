import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { dateAndTimeValidator } from '../../infrastructure/validators/dateAndTimeValidator';
import { futureDateValidator } from '../../infrastructure/validators/futureDateValidator';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { Event } from '../model/event.model';
import { EventRequest } from '../model/event.request.model';
import { EventType } from '../model/event.type.model';
import { PrivacyType } from '../model/privacy-type.model';
import { EventTypeService } from '../service/event-type.service';
import { EventService } from '../service/event.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
})
export class EventFormComponent implements OnInit {
  form!: FormGroup;
  eventTypes: EventType[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private eventTypeService: EventTypeService,
    private toastService: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadEventTypes();
  }

  private initForm() {
    this.form = this.fb.group(
      {
        eventTypeId: [null],
        name: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', Validators.maxLength(500)],
        maxParticipants: [null, [Validators.min(1)]],
        privacyType: [PrivacyType.PRIVATE, Validators.required],
        startDate: [null, [Validators.required, futureDateValidator()]],
        endDate: [null, [Validators.required, futureDateValidator()]],
        startTime: [null, Validators.required],
        endTime: [null, Validators.required],
        location: this.fb.group({
          city: ['', Validators.required],
          country: ['', Validators.required],
          address: ['', Validators.required],
        }),
      },
      { validators: dateAndTimeValidator },
    );
  }

  private loadEventTypes() {
    this.isLoading = true;
    this.eventTypeService
      .getEventTypes()
      .pipe(
        catchError((error) => {
          console.error('Error loading categories', error);
          return of([]);
        }),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe((eventTypes) => {
        this.eventTypes = eventTypes;
      });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.isLoading = true;

    const formValues = this.form.value;
    const eventRequest: EventRequest = {
      eventTypeId: formValues.eventTypeId,
      name: formValues.name,
      description: formValues.description,
      maxParticipants: formValues.maxParticipants,
      privacyType: formValues.privacyType,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      startTime: formValues.startTime,
      endTime: formValues.endTime,
      location: {
        country: formValues.location.country,
        city: formValues.location.city,
        address: formValues.location.address,
      },
    };

    this.eventService.createEvent(eventRequest).subscribe({
      next: (event: Event) => {
        this.isLoading = false;
        this.form.reset();
        this.toastService.success('Successfully created a new event.');
        this.router.navigate(['/event', event.id, 'agenda']);
      },
      error: (error: ErrorResponse) => {
        this.isLoading = false;
        this.toastService.error(error.message, 'Failed to create event');

        if (error.errors) {
          Object.keys(error.errors).forEach((fieldName) => {
            const control = this.form.get(fieldName);
            if (control) {
              control.setErrors({ serverError: error.errors[fieldName] });
            }
          });
        }
      },
    });
  }
}
