import { Component, Input, OnInit } from '@angular/core';
import { HomeOffering } from '../model/home-offering.model';
import { DecimalPipe } from '@angular/common';
import { OfferingFilterParams } from '../model/home-offering-filter-params-model';
import { OfferingService } from '../services/offering.service';
import { FavouriteOfferingsService } from '../services/favourite-offerings.service';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { FavouriteOffering } from '../model/favorite-offering.model';
import { ToastrService } from 'ngx-toastr';

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
    favoriteOffer: FavouriteOffering = {
      offeringId: -1
    }

  @Input()
  filterParams?: OfferingFilterParams;

  constructor(
    private offeringService: OfferingService,
    private decimalPipe: DecimalPipe,
    private favoriteService: FavouriteOfferingsService,
    private authService: AuthService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getOfferings(this.currentPage);
  }

  filterOfferings(filterParams: OfferingFilterParams): void {
    this.filterParams = filterParams;
    this.getOfferings(this.currentPage);
  }

  formatRating(rating: number): string {
    return this.decimalPipe.transform(rating, '1.1') || '';
  }

  toggleFavouriteOfferings(offer: HomeOffering): void {
    const temp = this.authService.getUser()?.userId;
    console.log(offer.isService)
    if(temp){
      if(offer.isFavourite){
        if(offer.isService){
          this.favoriteService.deleteFavoriteService(temp, offer.id).subscribe({
            next: ()=>{
              offer.isFavourite = !offer.isFavourite;
              this.toastService.success(
                `${offer.name} successfully removed from favorites!`,
              );
            }
          })
        }else{
          this.favoriteService.deleteFavoriteProduct(temp, offer.id).subscribe({
            next: ()=>{
              offer.isFavourite = !offer.isFavourite;
                this.toastService.success(
                `${offer.name} successfully removed from favorites!`,
              );
            }
          })
        }

      }else{
        this.favoriteOffer.offeringId = offer.id;
        if(offer.isService){
          this.favoriteService.addFavoriteService(temp, this.favoriteOffer).subscribe({
            next: () => {
              offer.isFavourite = !offer.isFavourite;
                this.toastService.success(
                `${offer.name} successfully added to favorites!`,
              );
            },
            
          })
        }else{
          this.favoriteService.addFavoriteProduct(temp, this.favoriteOffer).subscribe({
            next: ()=>{
              offer.isFavourite = !offer.isFavourite;
              this.toastService.success(
                `${offer.name} successfully added to favorites!`,
              );
            }
          })
        }
      }
      
    }
    
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
    if (this.currentPage < this.totalPages-1) {
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
}
