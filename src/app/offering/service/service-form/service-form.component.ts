import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDialogInformationComponent } from '../service-dialog/service-dialog-information.component';
import { OfferingServiceService } from '../offering-service.service';
import { Offeringtype } from '../model/offering.type.enum';
import { ReservationType } from '../model/reservation.type.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from '../model/service';
import { OfferingCategory } from '../../offering-category/model/offering-category';
import { ServiceCreateDTO } from '../model/serviceCreateDTO';
import { OfferingCategoryService } from '../../offering-category/offering-category.service';
import { EventTypeService } from '../../../event/service/event-type.service';
import { EventTypePreviewModel } from '../../../event/model/event.type.preview.model';
import { ServiceUpdateDTO } from '../model/serviceUpdateDTO';
import { minArrayLength } from '../../../shared/model/Validators';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.scss'
})
export class ServiceFormComponent {
  //attr
  firstFormGroup = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(3)]),
    description: new FormControl("", [Validators.required]),
    specifics: new FormControl(),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    eventTypes: new FormControl<number[]>([], [minArrayLength(1)]),
    categoryTypeId: new FormControl<number>(-1),
    categoryTypeName: new FormControl<String>("", [Validators.required])
  })
  secondFormGroup = new FormGroup({
    isAvailable: new FormControl(false),
    isVisible: new FormControl(false)
  })
  offeringCategoryTypeAll: Map<number, String> = new Map(); // options 
  eventTypeAll: Map<number, String> = new Map(); // options
  imagesService: string[] = [];
  reservationTypeString: string = ''
  reservationTypeService: ReservationType = ReservationType.MANUAL;
  get name() {
    return this.firstFormGroup.get('name');
  }
  get price() {
    return this.firstFormGroup.get('price')
  }
  get description() {
    return this.firstFormGroup.get('description')
  }
  get offeringCategoryName() {
    return this.firstFormGroup.get('categoryTypeName');
  }
  get eventTypes() {
    return this.firstFormGroup.get('eventTypes')
  }

  @ViewChild('stepper') stepper: any;
  onFirstStepDone() {
    this.firstFormGroup.markAllAsTouched();
    if (!this.firstFormGroup.valid) {
      return;
    }
    this.stepper.next();
  }
  onSecondStepDone(){
    if(!this.arrangementValidator && !this.isDurationShow){
      return
    }
    this.stepper.next();
  }

  arrangementValidator = true;
  validatorArrangement() {
    this.arrangementValidator = this.minArrangementFront >= this.maxArrangementFront ? false : true
  }

  constructor(private router: Router, private route: ActivatedRoute, public dialog: MatDialog, private serviceMenager: OfferingServiceService, private offeringCategoriesService: OfferingCategoryService, 
    private eventTypeService: EventTypeService, private authService : AuthService) {
  }

  @Output() toggle = new EventEmitter<void>();

  openSaveDialog() {
    const dialogRef = this.dialog.open(ServiceDialogInformationComponent, {
      data: {
        massage: this.firstFormGroup.value.name + " is successfully created!"
      }
    })

    dialogRef.afterClosed().subscribe((result) => {
      this.backToHome();
    });
  }
  openErrorDialog(s: String) {
    const dialogRef = this.dialog.open(ServiceDialogInformationComponent, {
      data: {
        massage: this.firstFormGroup.value.name + " is successfully updated!"
      }
    })
  }

  saveService() {
    this.firstFormGroup.markAllAsTouched();
    this.firstFormGroup.get('price')?.markAsDirty();
    if (this.firstFormGroup.valid) {
      this.setupModels();

      if (this.isEditMode) {
        const service = this.updateService()
        this.serviceMenager.updateService(service, this.updatingServiceId).subscribe({
          next: (s: Service) => {
            this.router.navigate(['/service/services'])
            this.openSaveDialog();
          },
          error: (err) => {
            this.openErrorDialog("not created, server error")
          }
        })
      } else {
        const service = this.createService();
        this.serviceMenager.addService(service).subscribe({
          next: (s: Service) => {
            this.router.navigate(['/service/services'])
            this.openSaveDialog();
          },
          error: (err) => {
            this.openErrorDialog("not created, server error")
          }
        });
      }


    }
  }
  createService() {
    const service: ServiceCreateDTO = {
      name: this.firstFormGroup.value.name,
      description: this.firstFormGroup.value.description,
      price: this.firstFormGroup.value.price,
      images: this.imagesService, // TODO
      discount: this.discountFront,
      visible: this.secondFormGroup.value.isVisible,
      available: this.secondFormGroup.value.isAvailable,
      specifics: this.firstFormGroup.value.specifics,
      duration: this.durationtFront,
      cancellationDeadline: this.cancellationDeadlinfront,
      reservationDeadline: this.reservationDeadlineFront,
      reservationType: this.reservationTypeService,
      ownerId: this.loggedOwner,
      eventTypesIDs: this.firstFormGroup.value.eventTypes,
      minimumArrangement: this.minArrangementFront,
      maximumArrangement: this.maxArrangementFront,
      offeringCategoryName: this.firstFormGroup.value.categoryTypeName
    };
    if (this.firstFormGroup.value.categoryTypeId === -1) {
      service.offeringCategoryID = null
    } else {
      service.offeringCategoryID = this.firstFormGroup.value.categoryTypeId;
    }
    return service;
  }
  updateService() {
    const service: ServiceUpdateDTO = {
      name: this.firstFormGroup.value.name,
      description: this.firstFormGroup.value.description,
      price: this.firstFormGroup.value.price,
      images: this.imagesService, // TODO
      discount: this.discountFront,
      visible: this.secondFormGroup.value.isVisible,
      available: this.secondFormGroup.value.isAvailable,
      specifics: this.firstFormGroup.value.specifics,
      duration: this.durationtFront,
      cancellationDeadline: this.cancellationDeadlinfront,
      reservationDeadline: this.reservationDeadlineFront,
      reservationType: this.reservationTypeService,
      eventTypesIDs: this.firstFormGroup.value.eventTypes,
      minimumArrangement: this.minArrangementFront,
      maximumArrangement: this.maxArrangementFront,
      status: Offeringtype.ACCEPTED
    };
    return service;
  }

  addImage() {
    const newImage = 'https://static.vecteezy.com/system/resources/previews/009/875/161/non_2x/3d-like-hand-with-blue-speech-bubble-free-png.png';
    this.imagesService.push(newImage);
  }
  deleteImage(index: number): void {
    this.imagesService.splice(index, 1);
  }
  backToHome() {
    this.router.navigate(['/service/services']);
  }

  onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 2) {
      this.saveButtonShow = true;
      this.cancelButtonShow = false;
    }
    else if (event.selectedIndex === 1) {
      this.saveButtonShow = false;
      this.cancelButtonShow = false;
    }
    else if (event.selectedIndex === 0) {
      this.saveButtonShow = false;
      this.cancelButtonShow = true;
    }
    else {
      this.saveButtonShow = false;
      this.cancelButtonShow = true;
    }
  }

  // you are not able to pick both, when we create an object we can check which one to choose
  checkDurationOrArrangement() {
    if (this.isDurationShow) {
      this.minArrangementFront = -1;
      this.maxArrangementFront = -1;
    }
    else {
      this.durationtFront = -1;
    }
  }
  checkReservationType() {
    if (this.reservationTypeString === 'Manual') {
      this.reservationTypeService = ReservationType.MANUAL;
    } else if (this.reservationTypeString === 'Automatic') {
      this.reservationTypeService = ReservationType.AUTOMATIC;
    }
  }
  // set up requestDTO
  setupModels() {
    // enum
    this.checkReservationType();
    //bonus
    this.checkDurationOrArrangement()
  }

  getOfferingCategories() {
    this.offeringCategoriesService.getAll().subscribe({
      next: (res: OfferingCategory[]) => {
        res.forEach(element => {
          this.offeringCategoryTypeAll.set(element.id, element.name)
        });
      }
    })
  }
  getEventTypes() {
    this.eventTypeService.getAllEventTypes().subscribe({
      next: (res: EventTypePreviewModel[]) => {
        this.eventTypeAll.clear();
        res.forEach(elem => {
          this.eventTypeAll.set(elem.id, elem.name);
        })
      }
    })
  }

  onInputCategory(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    if (!Array.from(this.offeringCategoryTypeAll.values()).includes(input)) {
      this.firstFormGroup.patchValue({
        categoryTypeId: -1,
        categoryTypeName: input
      })
    }


  }
  onOptionSelectedCategory(event: any): void {
    const selectedOption = event.option.value; // offering category type ID
    this.firstFormGroup.patchValue({
      categoryTypeId: selectedOption,
      categoryTypeName: this.offeringCategoryTypeAll.get(selectedOption)
    })
  }
  onSelectionChange(): void {
    const selectedPositions: number[] = this.firstFormGroup.get('eventTypes')?.value || []; // event type IDs
    this.firstFormGroup.patchValue({
      eventTypes: selectedPositions
    })
  }


  titleForm: string = 'Create a service'
  isEditMode = false;
  actionDialog: string = 'Created'
  isDurationShow = true;
  saveButtonShow = false;
  cancelButtonShow = true;

  //set sliders
  formGroupDiscount = new FormGroup({
    discountt: new FormControl()
  })
  discountFront = 0;
  setSliderDiscount(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.discountFront = Number(inputElement.value);
  }

  formGroupCancellationDeadline = new FormGroup({
    cancellationDeadline: new FormControl()
  })
  cancellationDeadlinfront = 0;
  setSliderCancellationDeadline(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.cancellationDeadlinfront = Number(inputElement.value);
  }

  formGroupReservationDeadline = new FormGroup({
    reservationDeadline: new FormControl()
  })
  reservationDeadlineFront = 0;
  setSliderReservationDeadline(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.reservationDeadlineFront = Number(inputElement.value);
  }

  formGroupDuration = new FormGroup({
    duration: new FormControl()
  })
  durationtFront = 1;
  setSliderDuration(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.durationtFront = Number(inputElement.value);
  }

  formGroupMinArrangement = new FormGroup({
    minArrangement: new FormControl()
  })
  minArrangementFront = 0;
  setSliderMinArrangement(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.minArrangementFront = Number(inputElement.value);
  }

  formGroupMaxArrangement = new FormGroup({
    maxArrangement: new FormControl()
  })
  maxArrangementFront = 1;
  setSliderMaxArrangement(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.maxArrangementFront = Number(inputElement.value);
  }

  fillForm() {
    this.serviceMenager.getServiceById(this.updatingServiceId).subscribe({
      next: (s: Service) => {
        this.firstFormGroup.patchValue({
          name: s.name,
          description: s.description,
          specifics: s.specifics,
          price: s.price,
          categoryTypeId: s.offeringCategory.id,
          categoryTypeName: s.offeringCategory.name,
          eventTypes: s.eventTypes.map(e => e.id)
        })
        this.onSelectionChange();
        this.imagesService = s.images;
        this.isDisabledCategory = true
        if (s.reservationType == ReservationType.AUTOMATIC.toString()) {
          this.reservationTypeString = "Automatic"
        }
        else {
          this.reservationTypeString = "Manual"
        }
        this.secondFormGroup.patchValue({
          isAvailable: s.available,
          isVisible: s.visible
        })
        this.formGroupDiscount.patchValue({
          discountt: s.discount
        })
        this.discountFront = s.discount;

        this.formGroupDuration.patchValue({
          duration: s.duration == -1? 1:s.duration
        })
        this.durationtFront = this.formGroupDuration.value.duration;

        this.formGroupCancellationDeadline.patchValue({
          cancellationDeadline: s.cancellationDeadline
        })
        this.cancellationDeadlinfront = s.cancellationDeadline;

        this.formGroupReservationDeadline.patchValue({
          reservationDeadline: s.reservationDeadline
        })
        this.reservationDeadlineFront = s.reservationDeadline;

        this.formGroupMinArrangement.patchValue({
          minArrangement: s.minimumArrangement == -1 ? 1 :s.minimumArrangement
        })
        this.minArrangementFront = this.formGroupMinArrangement.value.minArrangement

        this.formGroupMaxArrangement.patchValue({
          maxArrangement: s.maximumArrangement == -1 ? 1 :s.maximumArrangement
        })
        this.maxArrangementFront = this.formGroupMaxArrangement.value.maxArrangement
      },
      error: (_) => {
        console.log("error")
      }
    })

  }

  loggedOwner : number | undefined;
  updatingServiceId: number = -1;
  isDisabledCategory: boolean = false
  ngOnInit() {
    const serviceName = this.route.snapshot.paramMap.get('id');
    this.updatingServiceId = Number(serviceName);
    if (serviceName) {
      this.titleForm = 'Edit the service'
      this.actionDialog = 'Edited'
      this.isEditMode = true;
      this.fillForm()
    }
    this.getOfferingCategories();
    this.getEventTypes();
    this.loggedOwner = this.authService.getUser()?.userId
  }


}
