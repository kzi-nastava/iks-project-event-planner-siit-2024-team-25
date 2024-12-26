import { Component, OnInit } from '@angular/core';
import { OfferingService } from '../../offering/services/offering.service';
import { OfferingFilterParams } from '../../offering/model/home-offering-filter-params-model';
import { HomeOffering } from '../../offering/model/home-offering.model';
import { DecimalPipe } from '@angular/common';
import { ProductPurchase } from '../model/product-purchase.model';

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

  products:ProductPurchase[] = []
  eventId!: number;
  eventTypeId! : number | undefined;

  constructor(
    private offeringService: OfferingService,
    private decimalPipe: DecimalPipe
  ) {}

  ngOnInit(): void {
    const eventFromState = window.history.state['event'];
    if (eventFromState) {
      this.eventId = eventFromState;
    }
    this.getAllProducts()
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
      this.getCurrentOfferings();
    }
  }

  getPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getCurrentOfferings();
    }
  }

  getCurrentOfferings(){
    if(this.currentContainer === "P"){
      this.getAllProducts()
    }else{
      this.getOfferings(this.currentPage);
    }
  }

  switchDisplay(container: String): void {
    if (container === 'PRODUCTS') {
      this.currentContainer = 'P';
    } else if (container === 'SERVICES') {
      this.currentContainer = 'S';
    }
    this.currentPage = 0
    this.getCurrentOfferings()
  }
  // products
  filterProducts(filterParamss: OfferingFilterParams):void{
    this.filterParams = filterParamss;
    this.eventTypeId = filterParamss.eventTypeId;
    this.getAllProducts();
  }
  getAllProducts() {
    this.offeringService.getProductsPurchase(this.currentPage, this.filterParams).subscribe({
      next: (res) =>{
        this.products = res.currentProducts;
        this.totalPages = res.totalPages;
      },
      error:(_)=>{
        console.log("error")
      }
    })
  }
}
