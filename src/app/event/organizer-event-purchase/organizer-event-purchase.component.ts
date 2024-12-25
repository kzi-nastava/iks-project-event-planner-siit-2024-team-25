import { Component, OnInit } from '@angular/core';
import { OfferingService } from '../../offering/services/offering.service';
import { OfferingFilterParams } from '../../offering/model/home-offering-filter-params-model';
import { HomeOffering } from '../../offering/model/home-offering.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-organizer-event-purchase',
  templateUrl: './organizer-event-purchase.component.html',
  styleUrl: './organizer-event-purchase.component.scss',
  providers: [DecimalPipe],
})
export class OrganizerEventPurchaseComponent implements OnInit {
  currentContainer: string = 'P';
  currentOfferings: HomeOffering[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  filterParams: OfferingFilterParams = {};
  eventId!: number;

  constructor(
    private offeringService: OfferingService,
    private decimalPipe: DecimalPipe
  ) {}

  ngOnInit(): void {
    const eventFromState = window.history.state['event'];
    if (eventFromState) {
      this.eventId = eventFromState;
      console.log(this.eventId);
    }
  }

  filterOfferings(filterParams: OfferingFilterParams): void {
    this.filterParams = filterParams;
    this.getOfferings(this.currentPage);
  }

  formatRating(rating: number): string {
    return this.decimalPipe.transform(rating, '1.1') || '';
  }

  toggleFavouriteOfferings(offering: HomeOffering): void {
    offering.isFavourite = !offering.isFavourite;
  }

  getOfferings(page: number) {
    this.offeringService.getOfferings(page, this.filterParams).subscribe({
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
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getOfferings(this.currentPage);
    }
  }

  getPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getOfferings(this.currentPage);
    }
  }

  switchDisplay(container: String): void {
    if (container === 'PRODUCTS') {
      this.currentContainer = 'P';
    } else if (container === 'SERVICES') {
      this.currentContainer = 'S';
    }
  }
}
