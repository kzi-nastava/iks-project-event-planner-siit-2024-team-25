import { CommonModule, KeyValuePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../infrastructure/material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { ListProductsComponent } from './list-products/list-products.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { ProductDialogInformationComponent } from './product-information-dialog/product-information-dialog.component';
import { ProductRoutingModule } from './product-routing.module';
import { ProductFormComponent } from './product-form/product-form.component';
import { FavouriteProductComponent } from './favourite-product/favourite-product.component';

@NgModule({
  declarations: [
    ProductDetailsComponent,
    ListProductsComponent,
    ProductCardComponent,
    ProductDialogComponent,
    ProductDialogInformationComponent,
    ProductFormComponent,
    FavouriteProductComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ProductRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    KeyValuePipe,
  ],exports: [
    FavouriteProductComponent
  ]
})
export class ProductModule {}
