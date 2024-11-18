import { Component, OnInit } from '@angular/core';
import { HomeOffering } from '../model/homeOfferings';
import { DecimalPipe } from '@angular/common';
import { OfferingService } from '../service/offering.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-top-offerings',
  templateUrl: './home-top-offerings.component.html',
  styleUrl: './home-top-offerings.component.scss',
  providers: [DecimalPipe]
})
export class HomeTopOfferingsComponent implements OnInit {

  topOfferings$: Observable<HomeOffering[]> = new Observable<HomeOffering[]>;

  constructor(private offeringService: OfferingService, private decimalPipe: DecimalPipe){}

  ngOnInit(): void {
    this.getTopOfferings();
  }

  getTopOfferings(){
    this.topOfferings$ = this.offeringService.getTopOfferings();
  }

  formatRating(rating: number): string {
    return this.decimalPipe.transform(rating, '1.1') || ''; 
  }

  toggleFavouriteOfferings(eventId: number): void {
    this.offeringService.toggleFavouriteOfferings(eventId);
  }


}
