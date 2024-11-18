import { Component, OnInit } from '@angular/core';
import { HomeOffering } from '../model/homeOfferings';
import { OfferingService } from '../service/offering.service';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-all-offerings',
  templateUrl: './home-all-offerings.component.html',
  styleUrl: './home-all-offerings.component.scss',
  providers: [DecimalPipe]
})
export class HomeAllOfferingsComponent implements OnInit {

  allOfferings$: Observable<HomeOffering[]> = new Observable<HomeOffering[]>;  
  currentPage: number = 1;

  constructor(private offeringService: OfferingService, private decimalPipe: DecimalPipe){}

  ngOnInit(): void {
    this.getOfferings(1);
  }

  formatRating(rating: number): string {
    return this.decimalPipe.transform(rating, '1.1') || ''; 
  }

  toggleFavouriteOfferings(eventId: number): void {
    this.offeringService.toggleFavouriteOfferings(eventId);
  }

  getOfferings(page: number){
    this.allOfferings$ = this.offeringService.getOfferings(page);
  }

  getNextPage(){
    this.currentPage++;
    this.getOfferings(this.currentPage);
  }

  getPreviousPage(){
    if(this.currentPage > 1){
      this.currentPage--;
      this.getOfferings(this.currentPage);
    } 
    
  }
  
}
