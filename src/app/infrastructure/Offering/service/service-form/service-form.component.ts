import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDialogInformationComponent } from '../service-dialog/service-dialog-information.component';
import { OfferingServiceService } from '../offering-service.service';
import { Offeringtype } from '../model/offering.type.enum';
import { ReservationType } from '../model/reservation.type.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from '../model/service';
import { EventType } from '../model/event-type';
import { OfferingCategory } from '../model/offering-category';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.scss'
})
export class ServiceFormComponent {


  constructor(private router:Router, private _formBuilder: FormBuilder,private route:ActivatedRoute, public dialog:MatDialog, private serviceMenager: OfferingServiceService) {}

  // service we send to the back
  service?: Service;
  titleForm: string = 'Create a service'

  // binding data
  idService: number = 90;
  nameService: string = '';
  descriptionService: string = '';
  specificsService: string = '';
  priceService: number = -1;
  eventTypesService: EventType[] = [];
  eventTypeServiceString: string[] = [];
  offeringCategoriesService: OfferingCategory[] = [];
  offeringCategoriesServiceString: string[] = [];
  offeringCategoryServiceString:string = '';
  reservationTypeService: ReservationType = ReservationType.AUTOMATIC;
  reservationTpeServiceString: string = 'Manual';
  offeringTypeService: Offeringtype = Offeringtype.PENDING;
  isAvailableService: boolean = false;
  isVisibleService: boolean = false;
  imagesService: string[]= [];
  sliderValueDiscount: number = 0;
  sliderValueDuration: number = 0;
  sliderValueMinArrangement: number = 0;
  sliderValueMaxArrangement: number = 0;
  sliderValueCancellationDeadline: number = 0;
  sliderValueReservationDeadline: number = 0;


  offeringCategories: string[] = ['One c', 'Two c', 'Three c']; // categories
  eventTypes: string[] = ['one e', 'two e', 'three e']// event types

  isEditMode = false;
  actionDialog: string = 'Created'
  isDurationShow = true;
  saveButtonShow = false;
  cancelButtonShow = true;

  firstFormGroup!: FormGroup;
  formToogle!: FormGroup;
  secondFormGroup!: FormGroup;
  formGroupDiscount!: FormGroup<any>;// slider
  formDuration!: FormGroup<any>;
  formMinMaxArr!:FormGroup<any>;
  formCancellationDeadline! : FormGroup<any>;
  formReservationDeadline!: FormGroup<any>;

  @Output() toggle = new EventEmitter<void>();

  openSaveDialog(){
    const dialogRef = this.dialog.open(ServiceDialogInformationComponent,{
      data:{
        serviceName: this.nameService,
        action: this.actionDialog
      }
    })

    dialogRef.afterClosed().subscribe((result) => {
        this.backToHome();
    });
  }

  addNewService(){
    this.updateFrontServiceData();
    if (this.isEditMode) {
      const updatedService = this.serviceMenager.updateService(this.service);
      if (updatedService) {
        this.router.navigate(['/servicePage']);
      }
    } else {
      const addedService = this.serviceMenager.addService(this.service);
      if (addedService) {
        this.router.navigate(['/servicePage']);
      }
    }
    this.refreshService(); 
  }

  addImage() {
    const newImage = 'assets/images/R.jpg'; 
    this.imagesService.push(newImage);
  }

  onSliderChange(event: any): void {
    this.sliderValueDiscount = event.value;
  }

  backToHome() {
    this.router.navigate(['/servicePage']);
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

  refreshService(){
    this.idService = 90;
    this.nameService = '';
    this.descriptionService = '';
    this.specificsService = '';
    this.priceService = -1;
    this.eventTypesService = [];
    this.eventTypeServiceString = [];
    this.offeringCategoriesService = [];
    this.offeringCategoriesServiceString = [];
    this.offeringCategoryServiceString = '';
    this.reservationTypeService = ReservationType.MANUAL;
    this.reservationTpeServiceString = 'Manual';
    this.offeringTypeService = Offeringtype.PENDING;
    this.isAvailableService = false;
    this.isVisibleService = false;
    this.imagesService= [];
    this.sliderValueCancellationDeadline = 0;
    this.sliderValueReservationDeadline = 0;
    this.sliderValueDiscount = 0;
    this.sliderValueDuration = 0;
    this.sliderValueMaxArrangement = 0;
    this.sliderValueMinArrangement = 0;
  }

  // you are not able to pick both, when we create an object we can check which one to choose
  checkDurationOrArrangement(){
    if(this.isDurationShow){
      this.sliderValueMinArrangement = -1;
      this.sliderValueMaxArrangement = -1;
    }
    else{
      this.sliderValueDuration = -1;
    }
  }

  //call ito send data from form to serviceManager
  updateFrontServiceData(){
    
    if (typeof this.offeringCategoriesServiceString === 'string') {
      this.offeringCategoriesServiceString = [this.offeringCategoriesServiceString]; 
    }
    if (typeof this.eventTypeServiceString === 'string') {
      this.eventTypeServiceString = [this.eventTypeServiceString]; 
    }
    this.eventTypesService = this.eventTypeServiceString.map(c => ({ name: c }));
    this.offeringCategoriesService = this.offeringCategoriesServiceString.map(c => ({ name: c }));
    if(this.reservationTpeServiceString === 'Manual'){
      this.reservationTypeService = ReservationType.MANUAL;
    }else if(this.reservationTpeServiceString === 'Automatic'){
      this.reservationTypeService = ReservationType.AUTOMATIC;
    }
    this.checkDurationOrArrangement();

    this.service = {
      id: 1000,
      name: this.nameService,
      description: this.descriptionService,
      price: this.priceService,
      images: this.imagesService,
      discount: this.sliderValueDiscount,
      isVisible: this.isVisibleService,
      isAvailable: this.isAvailableService,
      offeringTyoe: Offeringtype.PENDING,
      specifics: this.specificsService,
      duration: this.sliderValueDuration,
      cancellationDate: this.sliderValueCancellationDeadline,
      reservationDate: this.sliderValueReservationDeadline,
      reservationType: this.reservationTypeService,
      eventTypes: this.eventTypesService,
      offeringCategories: this.offeringCategoriesService,
      minArrangement: this.sliderValueMinArrangement,
      maxArrangement: this.sliderValueMaxArrangement
    };
  }

  //call if it is edit mode to setup forms
  setServiceDataFront(){
   
    if(this.service!= null){
      if(this.service?.reservationType == ReservationType.AUTOMATIC){
        this.reservationTpeServiceString = 'Automatic'
      }else{
        this.reservationTpeServiceString = 'Manual'
      }
      if(this.service?.duration < 0){
        this.isDurationShow = false
      }else{
        this.isDurationShow = true;
      }
      this.offeringCategories =[];
      this.eventTypes = [];
      for(let s of this.service.eventTypes){
        this.offeringCategories.push(s.name);
      }
      for(let s of this.service.offeringCategories){
        this.eventTypes.push(s.name);
      }
      this.nameService=this.service.name;
      this.descriptionService = this.service.description;
      this.priceService = this.service.price;
      this.imagesService = this.service.images;
      this.sliderValueDiscount = this.service.discount;
      this.isVisibleService = this.service.isVisible;
      this.isAvailableService = this.service.isAvailable;
      this.offeringTypeService = this.service.offeringTyoe;
      this.specificsService = this.service.specifics;
      this.sliderValueDuration = this.service.duration;
      this.sliderValueCancellationDeadline = this.service.cancellationDate;
      this.sliderValueReservationDeadline = this.service.reservationDate;
      this.reservationTypeService = this.service.reservationType;
      this.eventTypesService = this.service.eventTypes;
      this.offeringCategoriesService = this.service.offeringCategories;
      this.sliderValueMinArrangement = this.service.minArrangement;
      this.sliderValueMaxArrangement = this.service.maxArrangement;
    }

  }

  ngOnInit() {
    const serviceName = this.route.snapshot.paramMap.get('id');
    if (serviceName) {
      this.titleForm = 'Edit the service'
      this.actionDialog = 'Edited'
      this.isEditMode = true;
      this.idService = Number(serviceName)
      this.service = this.serviceMenager.getServiceById(this.idService);
      this.setServiceDataFront();
    }else{
      this.titleForm = 'Create a service'
      this.actionDialog = 'Created'
      this.service = {
        id: 0,
        name: '',
        description: '',
        price: 0,
        images: [],
        discount: 0,
        isVisible: false,
        isAvailable: false,
        offeringTyoe: Offeringtype.ACCEPTED,
        specifics: '',
        duration: 0,
        cancellationDate: 0,
        reservationDate: 0,
        reservationType: ReservationType.MANUAL,
        eventTypes: [],
        offeringCategories: [],
        minArrangement: 0,
        maxArrangement: 0
      }
    }
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.formMinMaxArr = new FormGroup({
      sliderValueMinArrangement: new FormControl(0),
      sliderValueMaxArrangement: new FormControl(0)
    });
    this.formDuration = new FormGroup({
      sliderValueDuration: new FormControl(0) 
    });
    this.formGroupDiscount = new FormGroup({
      sliderValueDiscount: new FormControl(1) 
    });
    this.formCancellationDeadline = new FormGroup({
      sliderValueCancellationDeadline:new FormControl(1)
    })
    this.formReservationDeadline = new FormGroup({
      sliderValueReservationDeadline: new FormControl(5)
    })
    this.formToogle = this._formBuilder.group({
      isDurationShow: [false],
    });
  }
}
