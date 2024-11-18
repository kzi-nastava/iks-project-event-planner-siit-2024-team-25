import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HomeOffering } from '../model/homeOfferings';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-home-offering-card',
  templateUrl: './home-offering-card.component.html',
  styleUrl: './home-offering-card.component.scss'
})
export class HomeOfferingCardComponent {

  @Input()
  offering!: HomeOffering;


  @Output()
  clicked: EventEmitter<HomeOffering> = new EventEmitter<HomeOffering>();

  changeFavouriteOffering(): void {
    this.clicked.emit(this.offering);
  }

  constructor(private decimalPipe: DecimalPipe){}

  formatRating(rating: number): string {
    return this.decimalPipe.transform(rating, '1.1') || ''; 
  }

  formatLocation(country: string, city: string){
    return country + "," + city;
  }

}
