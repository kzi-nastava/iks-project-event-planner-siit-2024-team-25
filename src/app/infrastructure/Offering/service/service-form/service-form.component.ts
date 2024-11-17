import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.scss'
})
export class ServiceFormComponent {


  constructor(private _formBuilder: FormBuilder) {}

  //hardcore
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  images: string[] = []; 

  isDurationShow = true;
  saveButtonShow = false;
  firstFormGroup!: FormGroup;
  formToogle!: FormGroup;
  secondFormGroup!: FormGroup;
  formGroupDiscount!: FormGroup<any>;// slider
  formDuration!: FormGroup<any>;
  formMinMaxArr!:FormGroup<any>;
  sliderValueDiscount: number = 1;
  sliderValueDuration: number = 1;
  sliderValueMinArrangement: number = 1;
  sliderValueMaxArrangement: number = 10;
  @Output() toggle = new EventEmitter<void>();

  addImage() {
    const newImage = 'assets/images/R.jpg'; 
    this.images.push(newImage);
  }

  onSliderChange(event: any): void {
    this.sliderValueDiscount = event.value;
  }

  onToggle() {
    this.toggle.emit();
  }
  onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 2) {
      this.saveButtonShow = true;
    } else if (event.previouslySelectedIndex === 2) {
      this.saveButtonShow = false;
    }
  }

  ngOnInit() {
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
    this.formToogle = this._formBuilder.group({
      isDurationShow: [false],
    });
  }
}
