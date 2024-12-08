import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDialogInformationComponent } from '../service-dialog/service-dialog-information.component';
import { OfferingServiceService } from '../offering-service.service';
import { Offeringtype } from '../model/offering.type.enum';
import { ReservationType } from '../model/reservation.type.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from '../model/service';
import { EventType } from '../model/event-type';
import { OfferingCategory } from '../../offering-category/model/offering-category';
import { ServiceCreateDTO } from '../model/serviceCreateDTO';
import { MatStepper } from '@angular/material/stepper';
import { OfferingCategoryType } from '../../offering-category/model/offering-category-type.enum';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.scss'
})
export class ServiceFormComponent {

  firstFormGroup = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(3)]),
    description: new FormControl("", [Validators.required]),
    specifics: new FormControl(),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    eventTypes: new FormControl([]),
    categoryType: new FormControl(),

  })
  get name() {
    return this.firstFormGroup.get('name');
  }
  get price(){
    return this.firstFormGroup.get('price')
  }
  get description(){
    return this.firstFormGroup.get('description')
  }
  isFirstValidPressed = false;

  @ViewChild('stepper') stepper: any;
  onFirstStepDone() {
    this.isFirstValidPressed = true;
    if (!this.firstFormGroup.valid) {
      
      return;
    }
    this.stepper.next();
  }

  formGroupDiscount = new FormGroup({
    discountt: new FormControl()
  })


  isAvailable: boolean = false;
  isVisible: boolean = false;
  reservationTypeString: string = ''
  reservationTypeService: ReservationType = ReservationType.MANUAL;
  imagesService: string[] = [];
  eventTypesService: EventType[] = [];
  categoryTypeService: OfferingCategory = { name: '' , description:"1", type:OfferingCategoryType.ACCEPTED, id:-1}

  constructor(private router: Router, private _formBuilder: FormBuilder, private route: ActivatedRoute, public dialog: MatDialog, private serviceMenager: OfferingServiceService) {
  }

  offeringCategoriesAll: string[] = ['One c', 'Two c', 'Three c']; // categories
  eventTypesAll: string[] = ['one e', 'two e', 'three e']// event types

  titleForm: string = 'Create a service'
  isEditMode = false;
  actionDialog: string = 'Created'
  isDurationShow = true;
  saveButtonShow = false;
  cancelButtonShow = true;

  formToogle!: FormGroup;
  secondFormGroup!: FormGroup;
  //formGroupDiscount!: FormGroup<any>;// sliders
  formDuration!: FormGroup<any>;
  formMinMaxArr!: FormGroup<any>;
  formCancellationDeadline!: FormGroup<any>;
  formReservationDeadline!: FormGroup<any>;

  sliderValueDiscount: number = 0;
  sliderValueDuration: number = 0;
  sliderValueMinArrangement: number = 0;
  sliderValueMaxArrangement: number = 0;
  sliderValueCancellationDeadline: number = 0;
  sliderValueReservationDeadline: number = 0;


  discountFront = 0;

  @Output() toggle = new EventEmitter<void>();

  setSliderFront(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.discountFront = Number(inputElement.value);
  }


  openSaveDialog() {
    const dialogRef = this.dialog.open(ServiceDialogInformationComponent, {
      data: {
        serviceName: this.firstFormGroup.value.name,
        action: this.actionDialog
      }
    })

    dialogRef.afterClosed().subscribe((result) => {
      this.backToHome();
    });
  }

  openErrorDialog(s: String) {
    const dialogRef = this.dialog.open(ServiceDialogInformationComponent, {
      data: {
        serviceName: this.firstFormGroup.value.name,
        action: s
      }
    })
  }

  addNewService() {
    /*if (this.isEditMode) {
      this.serviceMenager.updateService()
      if (updatedService) {
        this.router.navigate(['/service/services']);
      }
    } else */{
      if (this.firstFormGroup.valid) {
        this.setupModels();
        if (this.firstFormGroup.invalid) {
          console.log('Form is invalid:', this.firstFormGroup.errors);
          return;
        }
        const service: ServiceCreateDTO = {
          name: this.firstFormGroup.get('name')?.value,
          description: this.firstFormGroup.value.description,
          price: this.firstFormGroup.value.price,
          images: this.imagesService,
          discount: this.discountFront,
          isVisible: this.isVisible,
          isAvailable: this.isAvailable,
          specifics: this.firstFormGroup.value.specifics,
          duration: this.sliderValueDuration,
          cancellationDeadline: this.sliderValueCancellationDeadline,
          reservationDeadline: this.sliderValueReservationDeadline,
          reservationType: this.reservationTypeService,
          ownerId: 11,
          eventTypesIDs: [1, 2, 3],
          offeringCategoryID: 1
        };
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

  addImage() {
    const newImage = 'assets/images/R.jpg';
    this.imagesService.push(newImage);
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
      this.sliderValueMinArrangement = -1;
      this.sliderValueMaxArrangement = -1;
    }
    else {
      this.sliderValueDuration = -1;
    }
  }

  setupModels() {
    if (this.firstFormGroup.value.eventTypes != null) {
      if (typeof this.firstFormGroup.value.eventTypes === 'string') {
        this.firstFormGroup.value.eventTypes = [this.firstFormGroup.value.eventTypes];
      }
      this.eventTypesService = this.firstFormGroup.value.eventTypes.map(c => ({ name: c }));
    }
    this.categoryTypeService = { name: this.firstFormGroup.value.categoryType, description:"1", type:OfferingCategoryType.ACCEPTED , id:-1};


    if (this.reservationTypeString === 'Manual') {
      this.reservationTypeService = ReservationType.MANUAL;
    } else if (this.reservationTypeString === 'Automatic') {
      this.reservationTypeService = ReservationType.AUTOMATIC;
    }
    this.checkDurationOrArrangement()
  }

  setupSliders() {
    this.formMinMaxArr = new FormGroup({
      sliderValueMinArrangement: new FormControl(0),
      sliderValueMaxArrangement: new FormControl(0)
    });
    this.formDuration = new FormGroup({
      sliderValueDuration: new FormControl(1)
    });
    this.formCancellationDeadline = new FormGroup({
      sliderValueCancellationDeadline: new FormControl(1)
    })
    this.formReservationDeadline = new FormGroup({
      sliderValueReservationDeadline: new FormControl(5)
    })
    this.formToogle = this._formBuilder.group({
      isDurationShow: [false],
    });
  }

  ngOnInit() {
    const serviceName = this.route.snapshot.paramMap.get('id');
    if (serviceName) {
      this.titleForm = 'Edit the service'
      this.actionDialog = 'Edited'
      this.isEditMode = true;
      //this.idService = Number(serviceName)
      //this.service = this.serviceMenager.getServiceById(this.idService);
      //this.setServiceDataFront();
    } else {
      this.titleForm = 'Create a service'
      this.actionDialog = 'Created'
      this.isEditMode = false;
    }

    this.setupSliders();



  }


}
