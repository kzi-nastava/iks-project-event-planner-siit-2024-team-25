import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceListComponent } from './price-list/price-list.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'price-list', component: PriceListComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfferingRoutingModule { }
