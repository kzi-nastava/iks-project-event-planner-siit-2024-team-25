import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeTopOfferingsComponent } from './home-top-offerings/home-top-offerings.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { HomeAllOfferingsComponent } from './home-all-offerings/home-all-offerings.component';
import { HomeOfferingCardComponent } from './home-offering-card/home-offering-card.component';
import { HomeOfferingFilterComponent } from './home-offering-filter/home-offering-filter.component';
import { FormsModule } from '@angular/forms'; // Uvoz FormsModule
import { ServiceModule } from './service/service.module';

@NgModule({
  declarations: [
    HomeTopOfferingsComponent,
    HomeAllOfferingsComponent,
    HomeOfferingCardComponent,
    HomeOfferingFilterComponent,
  ],
  imports: [CommonModule, FormsModule, ServiceModule, MaterialModule],
  exports: [HomeTopOfferingsComponent, HomeAllOfferingsComponent],
})
export class OfferingModule {}
