import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeTopOfferingsComponent } from './home-top-offerings/home-top-offerings.component';
import { MaterialModule } from '../infrastructure/material/material.module';



@NgModule({
  declarations: [
    HomeTopOfferingsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[
    HomeTopOfferingsComponent
  ]
})
export class OfferingModule { }
