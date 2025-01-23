import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HomeOffering } from '../model/home-offering.model';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-offering-card',
  templateUrl: './home-offering-card.component.html',
  styleUrl: './home-offering-card.component.scss',
})
export class HomeOfferingCardComponent {
  @Input()
  offering!: HomeOffering;

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

  showMoreDetails() {
    console.log(this.offering);
    if (this.offering.isService) {
      this.router.navigateByUrl('/service/services/' + this.offering.id);
    } else {
      this.router.navigateByUrl('/products/' + this.offering.id);
    }
  }
}
