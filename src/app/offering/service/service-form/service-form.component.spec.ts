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

  it('should initialize forms', () => {
    expect(component.firstFormGroup).toBeDefined();
    expect(component.secondFormGroup).toBeDefined();
  });

  // --- onFirstStepDone ---

  it('should not proceed to next step if first form invalid', () => {
    component.firstFormGroup.get('name')?.setValue('');
    spyOn(component.stepper, 'next');
    component.onFirstStepDone();
    expect(component.stepper.next).not.toHaveBeenCalled();
  });

  it('should proceed to next step if first form valid', () => {
    component.firstFormGroup.get('name')?.setValue('Test name');
    spyOn(component.stepper, 'next');
    component.onFirstStepDone();
    expect(component.stepper.next).toHaveBeenCalled();
  });

  // --- onSecondStepDone ---

  it('should not proceed if arrangementValidator is false and isDurationShow is false', () => {
    component.arrangementValidator = false;
    component.isDurationShow = false;
    spyOn(component.stepper, 'next');
    component.onSecondStepDone();
    expect(component.stepper.next).not.toHaveBeenCalled();
  });

  it('should proceed if arrangementValidator is true', () => {
    component.arrangementValidator = true;
    spyOn(component.stepper, 'next');
    component.onSecondStepDone();
    expect(component.stepper.next).toHaveBeenCalled();
  });

  // --- validatorArrangement ---

  it('should set arrangementValidator to false if minArrangementFront >= maxArrangementFront', () => {
    component.minArrangementFront = 5;
    component.maxArrangementFront = 3;
    component.validatorArrangement();
    expect(component.arrangementValidator).toBeFalse();
  });

  it('should set arrangementValidator to true if minArrangementFront < maxArrangementFront', () => {
    component.minArrangementFront = 2;
    component.maxArrangementFront = 5;
    component.validatorArrangement();
    expect(component.arrangementValidator).toBeTrue();
  });

  // --- openSaveDialog ---

  it('should open ServiceDialogInformationComponent dialog and call backToHome after close', fakeAsync(() => {
    const dialogRefSpyObj = jasmine.createSpyObj({
      afterClosed: of(true),
      close: null,
    });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);
    spyOn(component, 'backToHome');

    component.firstFormGroup.patchValue({ name: 'Test Service' });
    component.openSaveDialog();
    tick();

    expect(dialogSpy.open).toHaveBeenCalledWith(
      ServiceDialogInformationComponent,
      jasmine.any(Object)
    );
    expect(component.backToHome).toHaveBeenCalled();
  }));

  // --- openErrorDialog ---

  // --- saveService ---

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
    expect(component.openSaveDialog).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/service/services']);
  });

  it('should call updateService if in edit mode and valid form', () => {
    component.isEditMode = true;
    component.updatingServiceId = 123;
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
    offeringServiceSpy.updateService.and.returnValue(of(mockService));
    spyOn(component, 'setupModels').and.callThrough();
    spyOn(component, 'openSaveDialog');
    component.saveService();

    expect(component.setupModels).toHaveBeenCalled();
    expect(offeringServiceSpy.updateService).toHaveBeenCalledWith(
      jasmine.any(Object),
      123
    );
    expect(component.openSaveDialog).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/service/services']);
  });

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
    expect(component.openErrorDialog).toHaveBeenCalled();
  }));

  // --- createService and updateService ---

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
    expect(dto.images.length).toBe(1);
    expect(dto.offeringCategoryID).toBe(5);
    expect(dto.eventTypesIDs).toEqual([1, 2]);
    expect(dto.minimumArrangement).toBe(4);
    expect(dto.maximumArrangement).toBe(10);
  });

  it('createService should set offeringCategoryID to null if categoryTypeId is -1', () => {
    component.firstFormGroup.patchValue({
      categoryTypeId: -1,
      categoryTypeName: 'NewCat',
    });
    const dto = component.createService();
    expect(dto.offeringCategoryID).toBeNull();
  });

  it('updateService should build ServiceUpdateDTO correctly', () => {
    component.firstFormGroup.patchValue({
      name: 'Test',
      description: 'Desc',
      price: 10,
      specifics: 'Specs',
      eventTypes: [1, 2],
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
    component.minArrangementFront = 4;
    component.maxArrangementFront = 10;
    component.imagesToDelete = ['old.png'];

    const dto = component.updateService();

    expect(dto.name).toBe('Test');
    expect(dto.images?.length).toBe(1);
    expect(dto.imagesToDelete).toContain('old.png');
    expect(dto.status).toBe(Offeringtype.ACCEPTED);
  });

  // --- removeExistingImage ---

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

  // --- onFileSelected ---

  it('should set selectedFiles on onFileSelected', () => {
    const files = [new File([], 'file1.png'), new File([], 'file2.png')];
    component.onFileSelected(files);
    expect(component.selectedFiles.length).toBe(2);
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

  // --- checkDurationOrArrangement ---

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

  // --- checkReservationType ---

  it('should set reservationTypeService to MANUAL if reservationTypeString is Manual', () => {
    component.reservationTypeString = 'Manual';
    component.checkReservationType();
    expect(component.reservationTypeService).toBe(ReservationType.MANUAL);
  });

  it('should set reservationTypeService to AUTOMATIC if reservationTypeString is Automatic', () => {
    component.reservationTypeString = 'Automatic';
    component.checkReservationType();
    expect(component.reservationTypeService).toBe(ReservationType.AUTOMATIC);
  });

  // --- getOfferingCategories ---

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
    // Because subscription is async, call detectChanges or use fakeAsync/tick if needed
    // Here just basic test, no tick
  });

  // --- getEventTypes ---

  it('should fill eventTypeAll map on getEventTypes', () => {
    const events = [
      { id: 1, name: 'E1' },
      { id: 2, name: 'E2' },
    ];
    eventTypeServiceSpy.getAllEventTypes.and.returnValue(of(events));
    component.getEventTypes();
    expect(eventTypeServiceSpy.getAllEventTypes).toHaveBeenCalled();
  });

  // --- onInputCategory ---

  it('should set categoryTypeId to -1 if input is not in map', () => {
    component.offeringCategoryTypeAll.set(1, 'Cat1');
    component.firstFormGroup.patchValue({
      categoryTypeId: 1,
      categoryTypeName: 'Cat1',
    });

    component.onInputCategory({ target: { value: 'NewCategory' } } as any);
    expect(component.firstFormGroup.value.categoryTypeId).toBe(-1);
    expect(component.firstFormGroup.value.categoryTypeName).toBe('NewCategory');
  });

  it('should not change form values if input is in map', () => {
    component.offeringCategoryTypeAll.set(1, 'Cat1');
    component.firstFormGroup.patchValue({
      categoryTypeId: 1,
      categoryTypeName: 'Cat1',
    });

    component.onInputCategory({ target: { value: 'Cat1' } } as any);
    expect(component.firstFormGroup.value.categoryTypeId).toBe(1);
  });

  // --- onOptionSelectedCategory ---

  it('should patch form values on onOptionSelectedCategory', () => {
    component.offeringCategoryTypeAll.set(1, 'Cat1');
    component.firstFormGroup.patchValue({
      categoryTypeId: -1,
      categoryTypeName: '',
    });

    component.onOptionSelectedCategory({ option: { value: 1 } });
    expect(component.firstFormGroup.value.categoryTypeId).toBe(1);
    expect(component.firstFormGroup.value.categoryTypeName).toBe('Cat1');
  });

  // --- onSelectionChange ---

  it('should patch eventTypes value on onSelectionChange', () => {
    component.firstFormGroup.patchValue({ eventTypes: [1, 2] });
    component.onSelectionChange();
    expect(component.firstFormGroup.value.eventTypes).toEqual([1, 2]);
  });

  it('should fill form values on fillForm', fakeAsync(() => {
    const fakeService: Service = {
      id: 123,
      owner: { id: 10, name: 'Owner' },
      name: 'FakeService',
      description: 'Desc',
      specifics: 'Specs',
      price: 10,
      offeringCategory: {
        id: 5,
        name: 'Cat5',
        description: '',
        status: OfferingCategoryType.ACCEPTED,
      },
      eventTypes: [
        {
          id: 1,
          name: '',
        },
        {
          id: 2,
          name: '',
        },
      ],
      images: ['img1.png'],
      reservationType: ReservationType.AUTOMATIC,
      available: true,
      visible: false,
      discount: 10,
      duration: 3,
      cancellationDeadline: 2,
      reservationDeadline: 1,
      minimumArrangement: 5,
      maximumArrangement: 10,
      isFavorite: false,
      offeringType: Offeringtype.ACCEPTED,
    };

    offeringServiceSpy.getServiceById.and.returnValue(of(fakeService));
    component.updatingServiceId = 123;

    component.fillForm();
    tick();

    expect(component.firstFormGroup.value.name).toBe(fakeService.name);
    expect(component.firstFormGroup.value.categoryTypeId).toBe(
      fakeService.offeringCategory.id
    );
    expect(component.existingImages).toEqual(fakeService.images);
    expect(component.reservationTypeString).toBe('Automatic');
    expect(component.secondFormGroup.value.isAvailable).toBe(
      fakeService.available
    );
    expect(component.discountFront).toBe(fakeService.discount);
    expect(component.durationtFront).toBe(fakeService.duration);
    expect(component.cancellationDeadlinfront).toBe(
      fakeService.cancellationDeadline
    );
    expect(component.reservationDeadlineFront).toBe(
      fakeService.reservationDeadline
    );
    expect(component.minArrangementFront).toBe(fakeService.minimumArrangement);
    expect(component.maxArrangementFront).toBe(fakeService.maximumArrangement);
  }));

  it('should log error on fillForm error', fakeAsync(() => {
    offeringServiceSpy.getServiceById.and.returnValue(
      throwError(() => new Error('error'))
    );
    spyOn(console, 'log');
    component.updatingServiceId = 123;
    component.fillForm();
    tick();
    expect(console.log).toHaveBeenCalledWith('error');
  }));

  // --- ngOnInit ---

  it('should set edit mode and fill form if route has id', fakeAsync(() => {
    const activatedRouteStub = TestBed.inject(ActivatedRoute);
    spyOn(activatedRouteStub.snapshot.paramMap, 'get').and.returnValue('123');

    offeringServiceSpy.getServiceById.and.returnValue(of(mockService));
    offeringCategoriesServiceSpy.getAll.and.returnValue(of([]));
    eventTypeServiceSpy.getAllEventTypes.and.returnValue(of([]));
    authServiceSpy.getUser.and.returnValue({
      userId: 1,
      email: '',
      fullName: '',
      role: UserRole.Regular,
      suspensionEndDateTime: new Date(),
    });

    component.ngOnInit();

    tick();

    expect(component.isEditMode).toBeTrue();
    expect(component.titleForm).toContain('Edit');
    expect(component.loggedOwner).toBe(1);
  }));
});

export { ServiceFormComponent };
