import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { MaterialModule } from '../../infrastructure/material/material.module';
import { ProductRoutingModule } from './product-routing.module';



@NgModule({
  declarations: [
    ProductDetailsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ProductRoutingModule
  ]
})
export class ProductModule { }
