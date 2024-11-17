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

  isDurationShow = true;
  saveButtonShow = false;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  formGroup!: FormGroup<any>;// slider
  sliderValueDiscount: number = 0;
  sliderValueDuration: number = 1;
  sliderValueMinArrangement: number = 1;
  sliderValueMaxArrangement: number = 10;
  @Output() toggle = new EventEmitter<void>();

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
    this.formGroup = new FormGroup({
      sliderValueDiscount: new FormControl(0) 
    });
  }
}
