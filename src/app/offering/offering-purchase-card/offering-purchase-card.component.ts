import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HomeOffering } from '../model/home-offering.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-offering-purchase-card',
  templateUrl: './offering-purchase-card.component.html',
  styleUrl: './offering-purchase-card.component.scss',
})
export class OfferingPurchaseCardComponent {
  @Input()
  offering!: HomeOffering;

  @Output()
  clicked: EventEmitter<HomeOffering> = new EventEmitter<HomeOffering>();

  changeFavouriteOffering(): void {
    this.clicked.emit(this.offering);
  }

  constructor(private decimalPipe: DecimalPipe) {}

  formatRating(rating: number): string {
    return this.decimalPipe.transform(rating, '1.1') || '';
  }

  formatLocation(country: string, city: string) {
    return country + ',' + city;
  }
}
