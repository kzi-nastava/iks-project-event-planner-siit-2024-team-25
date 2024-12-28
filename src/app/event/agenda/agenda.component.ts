import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { dateAndTimeValidator } from '../../infrastructure/validators/dateAndTimeValidator';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { Activity } from '../model/activity.model';
import { Event } from '../model/event.model';
import { EventService } from '../service/event.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss',
})
export class AgendaComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  event?: Event;
  activities: Activity[] = [];
  waitingForResponse = false;
  private destroy$ = new Subject<void>();

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.checkEventId();
    this.initForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkEventId() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const eventId = params.get('id');
      if (eventId == null) {
        this.router.navigateByUrl('/events');
      } else {
        this.loadEvent(+eventId);
        this.loadAgenda(+eventId);
      }
    });
  }

  private loadEvent(eventId: number) {
    this.eventService.getEvent(eventId).subscribe({
      next: (event: Event) => {
        this.event = event;
      },
      error: (err: ErrorResponse) => {
        this.toastService.error(err.message, 'Failed to load event');
      },
    });
  }

  private loadAgenda(eventId: number) {
    this.eventService.getAgenda(eventId).subscribe({
      next: (activities: Activity[]) => {
        this.activities = activities;
      },
      error: (err: ErrorResponse) => {
        this.toastService.error(err.message, 'Failed to load event agenda');
      },
    });
  }

  private initForm() {
    this.form = this.fb.group(
      {
        name: ['', Validators.required],
        description: [''],
        startDate: [null, [Validators.required]],
        startTime: [null, [Validators.required]],
        endDate: [null, [Validators.required]],
        endTime: [null, [Validators.required]],
        location: [''],
      },
      { validators: [dateAndTimeValidator] },
    );
  }

  onSubmit() {
    if (!this.event || !this.form.valid) return;

    this.waitingForResponse = true;
    const formValue = this.form.value;
    const activity: Activity = {
      name: formValue.name,
      description: formValue.description,
      startTime: this.combineDateAndTime(
        formValue.startDate,
        formValue.startTime,
      ),
      endTime: this.combineDateAndTime(formValue.endDate, formValue.endTime),
      location: formValue.location,
    };

    this.eventService.addActivity(this.event.id!, activity).subscribe({
      next: (activity: Activity) => {
        this.waitingForResponse = false;
        this.toastService.success(
          `Successfully added ${activity.name} to agenda!`,
        );
        this.form.reset();
        this.form.setErrors({});
        this.loadAgenda(this.event!.id!);
      },
      error: (error: ErrorResponse) => {
        this.waitingForResponse = false;
        this.toastService.error(
          error.message,
          'Failed to add activity to agenda',
        );
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

  private combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime;
  }

  onRemove(activityId: number) {
    if (!this.event) return;

    this.eventService.removeActivity(this.event.id!, activityId).subscribe({
      next: () => {
        this.toastService.success('Successfully removed activity from agenda!');
        this.loadAgenda(this.event!.id!);
      },
      error: (error: ErrorResponse) => {
        this.toastService.error(error.message, 'Failed to remove activity');
      },
    });
  }

  openBudgetPlan() {
    if (!!this.event?.id) {
      this.router.navigate([`/event/budget-plan`], {
        state: { eventId: this.event.id },
      });
    }
  }
}
