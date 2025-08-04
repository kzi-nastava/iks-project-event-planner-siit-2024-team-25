import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HomeOffering } from '../../offering/model/home-offering.model';
import { ProductPurchase } from '../model/product-purchase.model';
import { PurchaseService } from '../service/purchase.service';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDialogInformationComponent } from '../../offering/service/service-dialog/service-dialog-information.component';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { ErrorDialogComponent } from '../../shared/error-dialog/error-dialog.component';

@Component({
  selector: 'app-product-to-buy-card',
  templateUrl: './product-to-buy-card.component.html',
  styleUrl: './product-to-buy-card.component.scss'
})
export class ProductToBuyCardComponent {



  @Input()
    offering!: ProductPurchase;
  
  @Input()
  eventId! : number;

  errorResponse!: ErrorResponse 

  constructor(private decimalPipe: DecimalPipe, 
    private router: Router, private purchaseService : PurchaseService, private dialog : MatDialog) {}

  formatRating(rating: number): string {
    return this.decimalPipe.transform(rating, '1.1') || '';
  }

  formatLocation(country: string, city: string) {
    return country + ', ' + city;
  }
  openProductDetails() {
    this.router.navigate(['/products/' + this.offering.id], {
      queryParams: { eventId: this.eventId },
    });
  }
  changeFavouriteOffering() {
    
  }
}
