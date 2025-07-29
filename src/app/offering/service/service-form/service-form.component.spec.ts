import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ServiceFormComponent } from './service-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

// Servisi i komponente za mocking
import { OfferingServiceService } from '../offering-service.service';
import { OfferingCategoryService } from '../../offering-category/offering-category.service';
import { EventTypeService } from '../../../event/service/event-type.service';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { ServiceDialogInformationComponent } from '../service-dialog/service-dialog-information.component';
import { ErrorDialogComponent } from '../../../shared/error-dialog/error-dialog.component';
import { UserRole } from '../../../infrastructure/auth/model/user-role.model';
import { Service } from '../model/service';
import { OfferingCategoryType } from '../../offering-category/model/offering-category-type.enum';
import { ReservationType } from '../model/reservation.type.enum';
import { Offeringtype } from '../../model/offering.type.enum';
import { OfferingCategory } from '../../offering-category/model/offering-category';
import { MaterialModule } from '../../../infrastructure/material/material.module';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const mockService: Service = {
  id: 1,
  name: 'Mock Service',
  description: 'Mock description',
  price: 100,
  specifics: 'Specifics',
  offeringCategory: {
    id: 1,
    name: 'Mock Category',
    description: '',
    status: OfferingCategoryType.ACCEPTED,
  },
  eventTypes: [{ id: 1, name: 'EventType1' }],
  images: ['mock-img.png'],
  reservationType: ReservationType.AUTOMATIC,
  available: true,
  visible: true,
  discount: 10,
  duration: 3,
  cancellationDeadline: 2,
  reservationDeadline: 1,
  minimumArrangement: 2,
  maximumArrangement: 10,
  isFavorite: false,
  owner: { id: 1, name: 'Owner Name' },
  offeringType: Offeringtype.ACCEPTED,
};

describe('ServiceFormComponent', () => {
  let component: ServiceFormComponent;
  let fixture: ComponentFixture<ServiceFormComponent>;
  let offeringServiceSpy: jasmine.SpyObj<OfferingServiceService>;
  let offeringCategoriesServiceSpy: jasmine.SpyObj<OfferingCategoryService>;
  let eventTypeServiceSpy: jasmine.SpyObj<EventTypeService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    offeringServiceSpy = jasmine.createSpyObj('OfferingServiceService', [
      'getServiceById',
      'addService',
      'updateService',
    ]);
    offeringCategoriesServiceSpy = jasmine.createSpyObj(
      'OfferingCategoryService',
      ['getAll']
    );
    eventTypeServiceSpy = jasmine.createSpyObj('EventTypeService', [
      'getAllEventTypes',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ServiceFormComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        RouterTestingModule,
        MaterialModule,
        SharedModule,
        CommonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: OfferingServiceService, useValue: offeringServiceSpy },
        {
          provide: OfferingCategoryService,
          useValue: offeringCategoriesServiceSpy,
        },
        { provide: EventTypeService, useValue: eventTypeServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => null } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceFormComponent);
    component = fixture.componentInstance;
    offeringCategoriesServiceSpy.getAll.and.returnValue(of([]));
    eventTypeServiceSpy.getAllEventTypes.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('should initialize forms', () => {
      expect(component.firstFormGroup).toBeDefined();
      expect(component.secondFormGroup).toBeDefined();
    });
  });
  describe('First step done', () => {
    it('should proceed to next step if first form valid', () => {
      component.firstFormGroup.get('name')?.setValue(mockService.name);
      component.firstFormGroup
        .get('description')
        ?.setValue(mockService.description);
      component.firstFormGroup
        .get('specifics')
        ?.setValue(mockService.specifics);
      component.firstFormGroup.get('price')?.setValue(mockService.price);
      component.firstFormGroup
        .get('eventTypes')
        ?.setValue(mockService.eventTypes.map((x) => x.id));
      component.firstFormGroup
        .get('categoryTypeId')
        ?.setValue(mockService.offeringCategory.id);
      component.firstFormGroup
        .get('categoryTypeName')
        ?.setValue(mockService.offeringCategory.name);
      spyOn(component.stepper, 'next');
      component.onFirstStepDone();
      expect(component.stepper.next).toHaveBeenCalled();
    });
    it('should proceed to next step if specifics is empty', () => {
      component.firstFormGroup.get('name')?.setValue(mockService.name);
      component.firstFormGroup
        .get('description')
        ?.setValue(mockService.description);
      component.firstFormGroup.get('specifics')?.setValue('');
      component.firstFormGroup.get('price')?.setValue(mockService.price);
      component.firstFormGroup
        .get('eventTypes')
        ?.setValue(mockService.eventTypes.map((x) => x.id));
      component.firstFormGroup
        .get('categoryTypeId')
        ?.setValue(mockService.offeringCategory.id);
      component.firstFormGroup
        .get('categoryTypeName')
        ?.setValue(mockService.offeringCategory.name);
      spyOn(component.stepper, 'next');
      component.onFirstStepDone();
      expect(component.stepper.next).toHaveBeenCalled();
    });
    it('should not proceed to next step if name is empty', () => {
      component.firstFormGroup.get('name')?.setValue('');
      component.firstFormGroup
        .get('description')
        ?.setValue(mockService.description);
      component.firstFormGroup
        .get('specifics')
        ?.setValue(mockService.specifics);
      component.firstFormGroup.get('price')?.setValue(mockService.price);
      component.firstFormGroup
        .get('eventTypes')
        ?.setValue(mockService.eventTypes.map((x) => x.id));
      component.firstFormGroup
        .get('categoryTypeId')
        ?.setValue(mockService.offeringCategory.id);
      component.firstFormGroup
        .get('categoryTypeName')
        ?.setValue(mockService.offeringCategory.name);
      spyOn(component.stepper, 'next');
      component.onFirstStepDone();
      expect(component.stepper.next).not.toHaveBeenCalled();
    });
    it('should not proceed to next step if name has less than 3 characters', () => {
      component.firstFormGroup.get('name')?.setValue('aa');
      component.firstFormGroup
        .get('description')
        ?.setValue(mockService.description);
      component.firstFormGroup
        .get('specifics')
        ?.setValue(mockService.specifics);
      component.firstFormGroup.get('price')?.setValue(mockService.price);
      component.firstFormGroup
        .get('eventTypes')
        ?.setValue(mockService.eventTypes.map((x) => x.id));
      component.firstFormGroup
        .get('categoryTypeId')
        ?.setValue(mockService.offeringCategory.id);
      component.firstFormGroup
        .get('categoryTypeName')
        ?.setValue(mockService.offeringCategory.name);
      spyOn(component.stepper, 'next');
      component.onFirstStepDone();
      expect(component.stepper.next).not.toHaveBeenCalled();
    });
    it('should not proceed to next step if description is empty', () => {
      component.firstFormGroup.get('name')?.setValue(mockService.name);
      component.firstFormGroup.get('description')?.setValue('');
      component.firstFormGroup
        .get('specifics')
        ?.setValue(mockService.specifics);
      component.firstFormGroup.get('price')?.setValue(mockService.price);
      component.firstFormGroup
        .get('eventTypes')
        ?.setValue(mockService.eventTypes.map((x) => x.id));
      component.firstFormGroup
        .get('categoryTypeId')
        ?.setValue(mockService.offeringCategory.id);
      component.firstFormGroup
        .get('categoryTypeName')
        ?.setValue(mockService.offeringCategory.name);
      spyOn(component.stepper, 'next');
      component.onFirstStepDone();
      expect(component.stepper.next).not.toHaveBeenCalled();
    });
    it('should not proceed to next step if description and name are empty', () => {
      component.firstFormGroup.get('name')?.setValue('');
      component.firstFormGroup.get('description')?.setValue('');
      component.firstFormGroup
        .get('specifics')
        ?.setValue(mockService.specifics);
      component.firstFormGroup.get('price')?.setValue(mockService.price);
      component.firstFormGroup
        .get('eventTypes')
        ?.setValue(mockService.eventTypes.map((x) => x.id));
      component.firstFormGroup
        .get('categoryTypeId')
        ?.setValue(mockService.offeringCategory.id);
      component.firstFormGroup
        .get('categoryTypeName')
        ?.setValue(mockService.offeringCategory.name);
      spyOn(component.stepper, 'next');
      component.onFirstStepDone();
      expect(component.stepper.next).not.toHaveBeenCalled();
    });
    it('should not proceed to next step if price is 0', () => {
      component.firstFormGroup.get('name')?.setValue(mockService.name);
      component.firstFormGroup
        .get('description')
        ?.setValue(mockService.description);
      component.firstFormGroup
        .get('specifics')
        ?.setValue(mockService.specifics);
      component.firstFormGroup.get('price')?.setValue(0);
      component.firstFormGroup
        .get('eventTypes')
        ?.setValue(mockService.eventTypes.map((x) => x.id));
      component.firstFormGroup
        .get('categoryTypeId')
        ?.setValue(mockService.offeringCategory.id);
      component.firstFormGroup
        .get('categoryTypeName')
        ?.setValue(mockService.offeringCategory.name);
      spyOn(component.stepper, 'next');
      component.onFirstStepDone();
      expect(component.stepper.next).not.toHaveBeenCalled();
    });
    it('should not proceed to next step if price is less than 0', () => {
      component.firstFormGroup.get('name')?.setValue(mockService.name);
      component.firstFormGroup
        .get('description')
        ?.setValue(mockService.description);
      component.firstFormGroup
        .get('specifics')
        ?.setValue(mockService.specifics);
      component.firstFormGroup.get('price')?.setValue(-2);
      component.firstFormGroup
        .get('eventTypes')
        ?.setValue(mockService.eventTypes.map((x) => x.id));
      component.firstFormGroup
        .get('categoryTypeId')
        ?.setValue(mockService.offeringCategory.id);
      component.firstFormGroup
        .get('categoryTypeName')
        ?.setValue(mockService.offeringCategory.name);
      spyOn(component.stepper, 'next');
      component.onFirstStepDone();
      expect(component.stepper.next).not.toHaveBeenCalled();
    });
    it('should not proceed to next step if description and name are empty and price is less than equal to 0', () => {
      component.firstFormGroup.get('name')?.setValue('');
      component.firstFormGroup.get('description')?.setValue('');
      component.firstFormGroup
        .get('specifics')
        ?.setValue(mockService.specifics);
      component.firstFormGroup.get('price')?.setValue(0);
      component.firstFormGroup
        .get('eventTypes')
        ?.setValue(mockService.eventTypes.map((x) => x.id));
      component.firstFormGroup
        .get('categoryTypeId')
        ?.setValue(mockService.offeringCategory.id);
      component.firstFormGroup
        .get('categoryTypeName')
        ?.setValue(mockService.offeringCategory.name);
      spyOn(component.stepper, 'next');
      component.onFirstStepDone();
      expect(component.stepper.next).not.toHaveBeenCalled();
    });
    it('should not proceed to next step if event types does not exist', () => {
      component.firstFormGroup.get('name')?.setValue(mockService.name);
      component.firstFormGroup
        .get('description')
        ?.setValue(mockService.description);
      component.firstFormGroup
        .get('specifics')
        ?.setValue(mockService.specifics);
      component.firstFormGroup.get('price')?.setValue(mockService.price);
      component.firstFormGroup.get('eventTypes')?.setValue([]);
      component.firstFormGroup
        .get('categoryTypeId')
        ?.setValue(mockService.offeringCategory.id);
      component.firstFormGroup
        .get('categoryTypeName')
        ?.setValue(mockService.offeringCategory.name);
      spyOn(component.stepper, 'next');
      component.onFirstStepDone();
      expect(component.stepper.next).not.toHaveBeenCalled();
    });
    it('should proceed to next step if service has one event type', () => {
      component.firstFormGroup.get('name')?.setValue(mockService.name);
      component.firstFormGroup
        .get('description')
        ?.setValue(mockService.description);
      component.firstFormGroup
        .get('specifics')
        ?.setValue(mockService.specifics);
      component.firstFormGroup.get('price')?.setValue(mockService.price);
      component.firstFormGroup
        .get('eventTypes')
        ?.setValue(mockService.eventTypes.map((x) => x.id));
      component.firstFormGroup
        .get('categoryTypeId')
        ?.setValue(mockService.offeringCategory.id);
      component.firstFormGroup
        .get('categoryTypeName')
        ?.setValue(mockService.offeringCategory.name);
      spyOn(component.stepper, 'next');
      component.onFirstStepDone();
      expect(component.stepper.next).toHaveBeenCalled();
    });
    it('should proceed to next step if there are two or more event types', () => {
      component.firstFormGroup.get('name')?.setValue(mockService.name);
      component.firstFormGroup
        .get('description')
        ?.setValue(mockService.description);
      component.firstFormGroup
        .get('specifics')
        ?.setValue(mockService.specifics);
      component.firstFormGroup.get('price')?.setValue(mockService.price);
      component.firstFormGroup.get('eventTypes')?.setValue([1, 2]);
      component.firstFormGroup
        .get('categoryTypeId')
        ?.setValue(mockService.offeringCategory.id);
      component.firstFormGroup
        .get('categoryTypeName')
        ?.setValue(mockService.offeringCategory.name);
      spyOn(component.stepper, 'next');
      component.onFirstStepDone();
      expect(component.stepper.next).toHaveBeenCalled();
    });
    it('should not proceed to next step if there is no offering category', () => {
      component.firstFormGroup.get('name')?.setValue(mockService.name);
      component.firstFormGroup
        .get('description')
        ?.setValue(mockService.description);
      component.firstFormGroup
        .get('specifics')
        ?.setValue(mockService.specifics);
      component.firstFormGroup.get('price')?.setValue(mockService.price);
      component.firstFormGroup
        .get('eventTypes')
        ?.setValue(mockService.eventTypes.map((x) => x.id));
      component.firstFormGroup.get('categoryTypeId')?.setValue(-2);
      component.firstFormGroup.get('categoryTypeName')?.setValue('');
      spyOn(component.stepper, 'next');
      component.onFirstStepDone();
      expect(component.stepper.next).not.toHaveBeenCalled();
    });
    it('should not proceed to next step if new offering category will be created', () => {
      component.firstFormGroup.get('name')?.setValue(mockService.name);
      component.firstFormGroup
        .get('description')
        ?.setValue(mockService.description);
      component.firstFormGroup
        .get('specifics')
        ?.setValue(mockService.specifics);
      component.firstFormGroup.get('price')?.setValue(mockService.price);
      component.firstFormGroup
        .get('eventTypes')
        ?.setValue(mockService.eventTypes.map((x) => x.id));
      component.firstFormGroup.get('categoryTypeId')?.setValue(-1);
      component.firstFormGroup
        .get('categoryTypeName')
        ?.setValue(mockService.offeringCategory.name);
      spyOn(component.stepper, 'next');
      component.onFirstStepDone();
      expect(component.stepper.next).toHaveBeenCalled();
    });
    it('should fill offeringCategoryTypeAll map on getOfferingCategories', () => {
      const categories: OfferingCategory[] = [
        {
          id: 1,
          name: 'Cat1',
          description: '',
          status: OfferingCategoryType.ACCEPTED,
        },
        {
          id: 2,
          name: 'Cat2',
          description: '',
          status: OfferingCategoryType.ACCEPTED,
        },
      ];
      offeringCategoriesServiceSpy.getAll.and.returnValue(of(categories));
      component.getOfferingCategories();
      expect(offeringCategoriesServiceSpy.getAll).toHaveBeenCalled();
    });
    it('should fill eventTypeAll map on getEventTypes', () => {
      const events = [
        { id: 1, name: 'E1' },
        { id: 2, name: 'E2' },
      ];
      eventTypeServiceSpy.getAllEventTypes.and.returnValue(of(events));
      component.getEventTypes();
      expect(eventTypeServiceSpy.getAllEventTypes).toHaveBeenCalled();
    });
    it('should set categoryTypeId to -1 if input is not in map', () => {
      component.offeringCategoryTypeAll.set(1, 'Cat1');
      component.firstFormGroup.patchValue({
        categoryTypeId: 1,
        categoryTypeName: 'Cat1',
      });

      component.onInputCategory({ target: { value: 'NewCategory' } } as any);
      expect(component.firstFormGroup.value.categoryTypeId).toBe(-1);
      expect(component.firstFormGroup.value.categoryTypeName).toBe(
        'NewCategory'
      );
    });
    it('should select right offering category', () => {
      component.offeringCategoryTypeAll.set(1, 'Cat1');
      component.firstFormGroup.patchValue({
        categoryTypeId: 1,
        categoryTypeName: 'Cat1',
      });

      component.onOptionSelectedCategory({ option: { value: 1 } } as any);
      expect(component.firstFormGroup.value.categoryTypeId).toBe(1);
    });
    it('should patch eventTypes value on onSelectionChange', () => {
      component.firstFormGroup.patchValue({ eventTypes: [1, 2] });
      component.onSelectionChange();
      expect(component.firstFormGroup.value.eventTypes).toEqual([1, 2]);
    });
    it('should update discountFront when slider value changes', () => {
      const fakeEvent = {
        target: {
          value: '30',
        },
      } as unknown as Event;

      component.setSliderDiscount(fakeEvent);

      expect(component.discountFront).toBe(30);
    });
  });

  describe('Second step done', () => {
    describe('Duration and arrangement validator', () => {
      it('should reset arrangements if isDurationShow is true', () => {
        component.isDurationShow = true;
        component.minArrangementFront = 5;
        component.maxArrangementFront = 10;
        component.checkDurationOrArrangement();
        expect(component.minArrangementFront).toBe(-1);
        expect(component.maxArrangementFront).toBe(-1);
      });
      it('should reset duration if isDurationShow is false', () => {
        component.isDurationShow = false;
        component.durationtFront = 5;
        component.checkDurationOrArrangement();
        expect(component.durationtFront).toBe(-1);
      });
      it('should proceed to next step if arrangementValidator is true', () => {
        component.arrangementValidator = true;
        component.isDurationShow = false;
        spyOn(component.stepper, 'next');
        component.onSecondStepDone();

        expect(component.stepper.next).toHaveBeenCalled();
      });
      it('should proceed to next step if isDurationShow is true', () => {
        component.arrangementValidator = false;
        component.isDurationShow = true;
        spyOn(component.stepper, 'next');
        component.onSecondStepDone();

        expect(component.stepper.next).toHaveBeenCalled();
      });
      it('should not proceed if both arrangementValidator and isDurationShow are false', () => {
        component.arrangementValidator = false;
        component.isDurationShow = false;
        spyOn(component.stepper, 'next');
        component.onSecondStepDone();

        expect(component.stepper.next).not.toHaveBeenCalled();
      });
      it('should set durationtFront from slider input', () => {
        const mockEvent = {
          target: { value: '5' },
        } as unknown as Event;

        component.setSliderDuration(mockEvent);

        expect(component.durationtFront).toBe(5);
      });
      it('should set minArrangementFront from slider input', () => {
        const mockEvent = {
          target: { value: '2' },
        } as unknown as Event;

        component.setSliderMinArrangement(mockEvent);

        expect(component.minArrangementFront).toBe(2);
      });
      it('should set maxArrangementFront from slider input', () => {
        const mockEvent = {
          target: { value: '10' },
        } as unknown as Event;

        component.setSliderMaxArrangement(mockEvent);

        expect(component.maxArrangementFront).toBe(10);
      });

      describe('validatorArrangement()', () => {
        it('should set arrangementValidator to false if min >= max', () => {
          component.minArrangementFront = 10;
          component.maxArrangementFront = 5;

          component.validatorArrangement();

          expect(component.arrangementValidator).toBeFalse();
        });
        it('should set arrangementValidator to false if min === max', () => {
          component.minArrangementFront = 5;
          component.maxArrangementFront = 5;

          component.validatorArrangement();

          expect(component.arrangementValidator).toBeFalse();
        });
        it('should set arrangementValidator to true if min < max', () => {
          component.minArrangementFront = 3;
          component.maxArrangementFront = 5;

          component.validatorArrangement();

          expect(component.arrangementValidator).toBeTrue();
        });
      });
    });

    describe('Reservation type', () => {
      it('should set reservationTypeService to MANUAL if reservationTypeString is Manual', () => {
        component.reservationTypeString = 'Manual';
        component.checkReservationType();
        expect(component.reservationTypeService).toBe(ReservationType.MANUAL);
      });

      it('should set reservationTypeService to AUTOMATIC if reservationTypeString is Automatic', () => {
        component.reservationTypeString = 'Automatic';
        component.checkReservationType();
        expect(component.reservationTypeService).toBe(
          ReservationType.AUTOMATIC
        );
      });
    });

    describe('Reservation and cancellation deadline', () => {
      it('should set cancellationDeadlinfront from slider input', () => {
        const mockEvent = {
          target: { value: '15' },
        } as unknown as Event;

        component.setSliderCancellationDeadline(mockEvent);

        expect(component.cancellationDeadlinfront).toBe(15);
      });
      it('should set reservationDeadlineFront from slider input', () => {
        const mockEvent = {
          target: { value: '7' },
        } as unknown as Event;

        component.setSliderReservationDeadline(mockEvent);

        expect(component.reservationDeadlineFront).toBe(7);
      });
    });

    describe('Visible and available', () => {
      it('should initialize secondFormGroup with false values', () => {
        expect(component.secondFormGroup.get('isAvailable')?.value).toBeFalse();
        expect(component.secondFormGroup.get('isVisible')?.value).toBeFalse();
      });
      it('should update isAvailable and isVisible values', () => {
        component.secondFormGroup.get('isAvailable')?.setValue(true);
        component.secondFormGroup.get('isVisible')?.setValue(true);

        expect(component.secondFormGroup.get('isAvailable')?.value).toBeTrue();
        expect(component.secondFormGroup.get('isVisible')?.value).toBeTrue();
      });
      it('should be valid when both controls are set', () => {
        component.secondFormGroup.setValue({
          isAvailable: true,
          isVisible: false,
        });

        expect(component.secondFormGroup.valid).toBeTrue();
      });
    });
  });
  describe('Third step done', () => {
    it('should remove image from existingImages and add to imagesToDelete in edit mode', () => {
      component.isEditMode = true;
      component.existingImages = ['img1.png', 'img2.png'];
      component.imagesToDelete = [];
      component.removeExistingImage('img1.png');
      expect(component.existingImages).not.toContain('img1.png');
      expect(component.imagesToDelete).toContain('img1.png');
    });

    it('should do nothing if not in edit mode on removeExistingImage', () => {
      component.isEditMode = false;
      component.existingImages = ['img1.png'];
      component.imagesToDelete = [];
      component.removeExistingImage('img1.png');
      expect(component.existingImages).toContain('img1.png');
      expect(component.imagesToDelete.length).toBe(0);
    });

    it('should set selectedFiles on onFileSelected', () => {
      const files = [new File([], 'file1.png'), new File([], 'file2.png')];
      component.onFileSelected(files);
      expect(component.selectedFiles.length).toBe(2);
    });
  });

  describe('Save service', () => {
    describe('Dialog interaction', () => {
      // --- openSaveDialog ---
      it('should navigate and open save dialog when service is created successfully', fakeAsync(() => {
        component.firstFormGroup.patchValue({
          name: 'Test Service',
          description: 'Test Description',
          price: 100,
          categoryTypeId: 2,
          categoryTypeName: 'Category',
          eventTypes: [1, 2],
        });
        component.secondFormGroup.patchValue({
          isVisible: true,
          isAvailable: true,
        });

        component.isEditMode = false;
        offeringServiceSpy.addService.and.returnValue(of(mockService));
        spyOn(component, 'openSaveDialog');
        component.saveService();

        tick();

        expect(offeringServiceSpy.addService).toHaveBeenCalled();
        expect(component.openSaveDialog).toHaveBeenCalled();
      }));

      // --- openErrorDialog ---
      it('should open error dialog on addService error', fakeAsync(() => {
        component.isEditMode = false;
        component.firstFormGroup.patchValue({
          name: 'ServiceName',
          description: 'Desc',
          price: 10,
          categoryTypeId: 1,
          categoryTypeName: 'Cat',
          eventTypes: [1],
        });
        component.secondFormGroup.patchValue({
          isVisible: true,
          isAvailable: true,
        });
        offeringServiceSpy.addService.and.returnValue(
          throwError(() => new Error('fail'))
        );
        spyOn(component, 'openErrorDialog');
        component.saveService();
        tick();
        expect(component.openErrorDialog).toHaveBeenCalledWith(
          'not created, server error'
        );
      }));
    });
    it('Should go to srvice page after successful save', fakeAsync(() => {
      component.firstFormGroup.patchValue({
        name: 'Test Service',
        description: 'Test Description',
        price: 100,
        categoryTypeId: 2,
        categoryTypeName: 'Category',
        eventTypes: [1, 2],
      });
      component.secondFormGroup.patchValue({
        isVisible: true,
        isAvailable: true,
      });

      component.isEditMode = false;
      offeringServiceSpy.addService.and.returnValue(of(mockService));
      dialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as any);

      component.saveService();

      tick();

      expect(offeringServiceSpy.addService).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/service/services']);
    }));
    it('createService should set offeringCategoryID to null if categoryTypeId is -1', () => {
      component.firstFormGroup.patchValue({
        categoryTypeId: -1,
        categoryTypeName: 'NewCat',
      });
      const dto = component.createService();
      expect(dto.offeringCategoryID).toBeNull();
    });

    it('should not save service if first form invalid', () => {
      component.firstFormGroup.get('name')?.setValue('');
      spyOn(component, 'setupModels');
      component.saveService();
      expect(component.setupModels).not.toHaveBeenCalled();
    });

    it('should call addService if not in edit mode and valid form', () => {
      component.isEditMode = false;
      component.firstFormGroup.patchValue({
        name: 'ServiceName',
        description: 'Desc',
        price: 10,
        categoryTypeId: 1,
        categoryTypeName: 'Cat',
        eventTypes: [1],
      });
      component.secondFormGroup.patchValue({
        isVisible: true,
        isAvailable: true,
      });
      offeringServiceSpy.addService.and.returnValue(of(mockService));
      spyOn(component, 'setupModels').and.callThrough();
      spyOn(component, 'openSaveDialog');
      component.saveService();

      expect(component.setupModels).toHaveBeenCalled();
      expect(offeringServiceSpy.addService).toHaveBeenCalled();
    });

    it('createService should build ServiceCreateDTO correctly', () => {
      component.firstFormGroup.patchValue({
        name: 'Test',
        description: 'Desc',
        price: 10,
        specifics: 'Specs',
        eventTypes: [1, 2],
        categoryTypeId: 5,
        categoryTypeName: 'CatName',
      });
      component.secondFormGroup.patchValue({
        isVisible: true,
        isAvailable: false,
      });
      component.selectedFiles = [new File([], 'file.png')];
      component.discountFront = 5;
      component.durationtFront = 10;
      component.cancellationDeadlinfront = 2;
      component.reservationDeadlineFront = 3;
      component.reservationTypeService = ReservationType.AUTOMATIC;
      component.loggedOwner = 42;
      component.minArrangementFront = 4;
      component.maxArrangementFront = 10;

      const dto = component.createService();

      expect(dto.name).toBe('Test');
      expect(dto.description).toBe('Desc');
      expect(dto.price).toBe(10);
      expect(dto.images.length).toBe(1);
      expect(dto.discount).toBe(5);
      expect(dto.visible).toBeTrue();
      expect(dto.available).toBeFalse();
      expect(dto.specifics).toBe('Specs');
      expect(dto.duration).toBe(10);
      expect(dto.cancellationDeadline).toBe(2);
      expect(dto.reservationDeadline).toBe(3);
      expect(dto.reservationType).toBe(ReservationType.AUTOMATIC);
      expect(dto.ownerId).toBe(42);
      expect(dto.eventTypesIDs).toEqual([1, 2]);
      expect(dto.minimumArrangement).toBe(4);
      expect(dto.maximumArrangement).toBe(10);
      expect(dto.offeringCategoryName).toBe('CatName');
      expect(dto.offeringCategoryID).toBe(5);
    });
  });

  // --- backToHome ---

  it('should navigate back to /service/services on backToHome', () => {
    component.backToHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/service/services']);
  });

  // --- onStepChange ---

  it('should update button visibility correctly in onStepChange', () => {
    component.onStepChange({ selectedIndex: 2 } as any);
    expect(component.saveButtonShow).toBeTrue();
    expect(component.cancelButtonShow).toBeFalse();

    component.onStepChange({ selectedIndex: 1 } as any);
    expect(component.saveButtonShow).toBeFalse();
    expect(component.cancelButtonShow).toBeFalse();

    component.onStepChange({ selectedIndex: 0 } as any);
    expect(component.saveButtonShow).toBeFalse();
    expect(component.cancelButtonShow).toBeTrue();

    component.onStepChange({ selectedIndex: 99 } as any);
    expect(component.saveButtonShow).toBeFalse();
    expect(component.cancelButtonShow).toBeTrue();
  });
});

export { ServiceFormComponent };
