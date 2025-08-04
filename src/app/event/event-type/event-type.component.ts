import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';

import { EventType } from '../model/event.type.model';
import { OfferingCategory } from '../model/offering-category.model';
import { EventTypeService } from '../service/event-type.service';

@Component({
  selector: 'app-event-type',
  templateUrl: './event-type.component.html',
  styleUrl: './event-type.component.scss',
})
export class EventTypeComponent implements OnInit {
  eventTypeForm!: FormGroup;
  offeringCategories: OfferingCategory[] = [];
  isLoading = false;
  isEditMode = false;
  eventTypeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private eventTypeService: EventTypeService,
    private route: ActivatedRoute,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadOfferingCategories();
    this.checkEditMode();
  }

  initForm() {
    this.eventTypeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      categories: this.fb.array([], Validators.required),
      isActive: [true],
    });
  }

  get categories() {
    return this.eventTypeForm.get('categories') as FormArray;
  }

  loadOfferingCategories() {
    this.isLoading = true;
    this.eventTypeService
      .getOfferingCategories()
      .pipe(
        catchError((error) => {
          console.error('Error loading categories', error);
          return of([]);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe((categories) => {
        this.offeringCategories = categories;
      });
  }

  checkEditMode() {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.eventTypeId = +idParam;
        this.isEditMode = true;
        this.loadEventTypeForEditing();
      }
    });
  }

  loadEventTypeForEditing() {
    if (this.eventTypeId) {
      this.isLoading = true;
      this.eventTypeService
        .getEventType(this.eventTypeId)
        .pipe(
          catchError((error) => {
            console.error('Error loading event type', error);
            return of(null);
          }),
          finalize(() => (this.isLoading = false))
        )
        .subscribe((eventType) => {
          if (eventType) {
            this.populateForm(eventType);
          }
        });
    }
  }

  populateForm(eventType: EventType) {
    this.eventTypeForm.patchValue({
      name: eventType.name,
      description: eventType.description,
      isActive: eventType.isActive,
      categories: eventType.categories.map((c) => c.id),
    });

    this.categories.clear();
    eventType.categories.forEach((category) => {
      this.categories.push(this.fb.control(category.id));
    });
  }

  toggleCategory(categoryId: number) {
    const categoryControl = this.categories;
    const index = categoryControl.value.indexOf(categoryId);

    if (index > -1) {
      categoryControl.removeAt(index);
    } else {
      categoryControl.push(this.fb.control(categoryId));
    }
  }

  isCategorySelected(categoryId: number): boolean {
    return this.categories.value.includes(categoryId);
  }

  onSubmit() {
    if (this.eventTypeForm.valid) {
      this.isLoading = true;
      const formValue = this.eventTypeForm.value;
      const eventType: EventType = {
        id: this.eventTypeId || 0,
        name: formValue.name,
        description: formValue.description,
        isActive: formValue.isActive,
        categories: formValue.categories,
      };

      const saveObservable = this.isEditMode
        ? this.eventTypeService.updateEventType(eventType)
        : this.eventTypeService.addEventType(eventType);

      saveObservable
        .pipe(
          catchError((error) => {
            console.error('Error saving event type', error);
            return of(null);
          }),
          finalize(() => (this.isLoading = false))
        )
        .subscribe((savedEventType) => {
          if (savedEventType) {
            this.toastService.success('Successfully saved event type!');
          }
        });
    }
  }
}
