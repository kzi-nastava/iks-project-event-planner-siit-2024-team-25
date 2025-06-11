import { Component, OnInit } from '@angular/core';
import { FavouriteOfferingsService } from '../services/favourite-offerings.service';

@Component({
  selector: 'app-favourite-offerings',
  templateUrl: './favourite-offerings.component.html',
  styleUrl: './favourite-offerings.component.scss'
})
export class FavouriteOfferingsComponent implements OnInit{
    
    loading = true;
    constructor(
      private favouriteOfferingService: FavouriteOfferingsService,
    ) {}
  
    ngOnInit(): void {
      console.log("ads")
    }
}
