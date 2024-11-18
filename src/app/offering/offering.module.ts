import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeTopOfferingsComponent } from './home-top-offerings/home-top-offerings.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { HomeAllOfferingsComponent } from './home-all-offerings/home-all-offerings.component';



@NgModule({
  declarations: [
    HomeTopOfferingsComponent,
    HomeAllOfferingsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[
    HomeTopOfferingsComponent,
    HomeAllOfferingsComponent
  ]
})
export class OfferingModule { }
