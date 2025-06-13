import { Component, OnInit } from '@angular/core';
import { FavouriteOfferingsService } from '../services/favourite-offerings.service';

@Component({
  selector: 'app-favourite-offerings',
  templateUrl: './favourite-offerings.component.html',
  styleUrl: './favourite-offerings.component.scss'
})
export class FavouriteOfferingsComponent implements OnInit{
  ngOnInit(): void {
  }
  currentContainer: String = "P";

  switchDisplay(container: String): void {
    if (container === 'PRODUCTS') {
      this.currentContainer = 'P';
    } else if (container === 'SERVICES') {
      this.currentContainer = 'S';
    }
  }
}
