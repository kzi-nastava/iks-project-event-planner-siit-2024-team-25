import { Component, Input, OnInit } from '@angular/core';
import { HomeOffering } from '../model/home-offering.model';
import { DecimalPipe } from '@angular/common';
import { OfferingFilterParams } from '../model/home-offering-filter-params-model';
import { OfferingService } from '../services/offering.service';

@Component({
  selector: 'app-home-all-offerings',
  templateUrl: './home-all-offerings.component.html',
  styleUrl: './home-all-offerings.component.scss',
  providers: [DecimalPipe],
})
export class HomeAllOfferingsComponent implements OnInit {
  currentOfferings: HomeOffering[] = [];
  currentPage: number = 0;
  totalPages: number = 1;

  @Input()
  filterParams?: OfferingFilterParams;

  constructor(
    private offeringService: OfferingService,
    private decimalPipe: DecimalPipe
  ) {}

  ngOnInit(): void {
    this.getOfferings(this.currentPage);
  }

  filterOfferings(filterParams: OfferingFilterParams): void {}

  formatRating(rating: number): string {
    return this.decimalPipe.transform(rating, '1.1') || '';
  }

  toggleFavouriteOfferings(offering: HomeOffering): void {
    offering.isFavourite = !offering.isFavourite;
  }

  getOfferings(page: number) {
    this.offeringService.getOfferings(page).subscribe({
      next: ({ currentOfferings, totalPages }) => {
        this.currentOfferings = currentOfferings;
        this.totalPages = totalPages;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      },
    });
  }

  getNextPage() {
    this.currentPage++;
    this.getOfferings(this.currentPage);
  }

  getPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getOfferings(this.currentPage);
    }
  }
}
