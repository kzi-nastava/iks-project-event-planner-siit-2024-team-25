import { Component, OnInit } from '@angular/core';
import { HomeOffering } from '../model/home-offering.model';
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

  topOfferings: HomeOffering[] = []
  constructor(private offeringService: OfferingService, private decimalPipe: DecimalPipe){}

  ngOnInit(): void {
    this.getTopOfferings();
  }

  getTopOfferings(){
    this.offeringService.getTopOfferings().subscribe({
      next: (topOfferings: HomeOffering[])=>{
        this.topOfferings = topOfferings;
      }
    })
  }

  changeFavouriteOffering(offer: HomeOffering): void{
    offer.isFavourite = !offer.isFavourite;
    }

}
