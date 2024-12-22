import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HomeOffering } from '../model/home-offering.model';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offering-purchase-card',
  templateUrl: './offering-purchase-card.component.html',
  styleUrl: './offering-purchase-card.component.scss',
})
export class OfferingPurchaseCardComponent {
  @Input()
  offering!: HomeOffering;

  @Input()
  eventId!: number;

  @Output()
  clicked: EventEmitter<HomeOffering> = new EventEmitter<HomeOffering>();

  changeFavouriteOffering(): void {
    this.clicked.emit(this.offering);
  }

  constructor(private decimalPipe: DecimalPipe, private router: Router) {}

  formatRating(rating: number): string {
    return this.decimalPipe.transform(rating, '1.1') || '';
  }

  formatLocation(country: string, city: string) {
    return country + ',' + city;
  }

  openServiceBookDialog(): void {
    this.router.navigate(['/services/' + this.offering.id], {
      queryParams: { eventId: this.eventId },
    });
  }
}
