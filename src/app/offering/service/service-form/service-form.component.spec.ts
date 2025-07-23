import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceFormComponent } from './service-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OfferingServiceService } from '../offering-service.service';
import { OfferingCategoryService } from '../../offering-category/offering-category.service';
import { EventTypeService } from '../../../event/service/event-type.service';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { Offeringtype } from '../../model/offering.type.enum';
import { ReservationType } from '../model/reservation.type.enum';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ImageUploadComponent } from '../../../shared/image-upload/image-upload.component';
import { CommonModule } from '@angular/common';
import { ServiceRoutingModule } from '../service-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../infrastructure/material/material.module';

describe('ServiceForm', () => {
  let component: ServiceFormComponent;
  let fixture: ComponentFixture<ServiceFormComponent>;

  const mockService = {
    id: 1,
    name: 'Mock Service',
    description: 'Mock description',
    price: 100,
    images: ['img1.jpg'],
    discount: 10,
    visible: true,
    available: true,
    offeringType: Offeringtype.ACCEPTED,
    specifics: 'Some specifics',
    duration: 60,
    cancellationDeadline: 24,
    reservationDeadline: 48,
    reservationType: ReservationType.MANUAL,
    eventTypes: [],
    minimumArrangement: 2,
    maximumArrangement: 5,
    offeringCategory: {
      id: 2,
      name: 'Test Category',
    },
    owner: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    },
    isFavorite: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceFormComponent],
      imports: [
        ReactiveFormsModule,
        CommonModule,
        ServiceRoutingModule,
        SharedModule,
        BrowserAnimationsModule,
        MaterialModule,
      ],
      providers: [
        {
          provide: OfferingServiceService,
          useValue: {
            getServiceById: () => of(mockService),
            addService: () => of({}),
            updateService: () => of({}),
          },
        },
        {
          provide: OfferingCategoryService,
          useValue: {
            getAll: () => of([]),
          },
        },
        {
          provide: EventTypeService,
          useValue: {
            getAllEventTypes: () => of([]),
          },
        },
        {
          provide: AuthService,
          useValue: {
            getUser: () => ({ userId: 123 }),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1', // edit mode
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms correctly', () => {
    expect(component.firstFormGroup).toBeDefined();
    expect(component.secondFormGroup).toBeDefined();
    expect(component.firstFormGroup.get('name')).toBeTruthy();
  });

  it('should not proceed to next step if first form is invalid', () => {
    component.firstFormGroup.get('name')?.setValue('');
    component.stepper = { next: jasmine.createSpy('next') } as any;
    component.onFirstStepDone();
    expect(component.stepper.next).not.toHaveBeenCalled();
  });

  it('should fill form when service is loaded in edit mode', () => {
    component.isEditMode = true;
    component.updatingServiceId = 1;
    component.fillForm();
    expect(component.firstFormGroup.get('name')?.value).toBe('Mock Service');
    expect(component.firstFormGroup.get('price')?.value).toBe(100);
    expect(component.existingImages).toEqual(['img1.jpg']);
    expect(component.discountFront).toBe(10);
    expect(component.secondFormGroup.get('isAvailable')?.value).toBe(true);
  });
});
