import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeTopOfferingsComponent } from './home-top-offerings/home-top-offerings.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { HomeAllOfferingsComponent } from './home-all-offerings/home-all-offerings.component';
import { HomeOfferingCardComponent } from './home-offering-card/home-offering-card.component';
import { HomeOfferingFilterComponent } from './home-offering-filter/home-offering-filter.component';
import { FormsModule } from '@angular/forms';
import { ServiceModule } from './service/service.module';
import { OfferingPurchaseCardComponent } from './offering-purchase-card/offering-purchase-card.component';
import { PurchaseOfferingFilterComponent } from './purchase-offering-filter/purchase-offering-filter.component';
import { PriceListComponent } from './price-list/price-list.component';
import { OfferingRoutingModule } from './offering-routing.module';
import { PriceListEditDialogComponent } from './price-list-edit-dialog/price-list-edit-dialog.component';
import { FavouriteOfferingsComponent } from './favourite-offerings/favourite-offerings.component';
import { ProductModule } from "./product/product.module";
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    HomeTopOfferingsComponent,
    HomeAllOfferingsComponent,
    HomeOfferingFilterComponent,
    OfferingPurchaseCardComponent,
    PurchaseOfferingFilterComponent,
    PriceListComponent,
    PriceListEditDialogComponent,
    FavouriteOfferingsComponent,
    HomeOfferingCardComponent
  ],
  imports: [CommonModule, FormsModule, MaterialModule, OfferingRoutingModule, ProductModule, ServiceModule, SharedModule],
  exports: [
    HomeTopOfferingsComponent,
    HomeAllOfferingsComponent,
    OfferingPurchaseCardComponent,
    PurchaseOfferingFilterComponent,
    FavouriteOfferingsComponent,
  ],
})
export class OfferingModule {}
