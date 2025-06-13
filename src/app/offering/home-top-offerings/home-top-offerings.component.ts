import { Component, OnInit } from '@angular/core';
import { HomeOffering } from '../model/home-offering.model';
import { DecimalPipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { OfferingService } from '../services/offering.service';
import { FavouriteOfferingsService } from '../services/favourite-offerings.service';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { FavouriteOffering } from '../model/favorite-offering.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-top-offerings',
  templateUrl: './home-top-offerings.component.html',
  styleUrl: './home-top-offerings.component.scss',
  providers: [DecimalPipe],
})
export class HomeTopOfferingsComponent implements OnInit {
  topOfferings: HomeOffering[] = [];
  favoriteOffer: FavouriteOffering = {
    offeringId: -1,
  };
  constructor(
    private offeringService: OfferingService,
    private decimalPipe: DecimalPipe,
    private favoriteService: FavouriteOfferingsService,
    private authService: AuthService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getTopOfferings();
  }

  getTopOfferings() {
    this.offeringService.getTopOfferings().subscribe({
      next: (topOfferings: HomeOffering[]) => {
        this.topOfferings = topOfferings;
      },
    });
  }

  changeFavouriteOffering(offer: HomeOffering): void {
    const temp = this.authService.getUser()?.userId;
    if (temp) {
      if (offer.isFavorite) {
        if (offer.isService) {
          this.favoriteService.deleteFavoriteService(temp, offer.id).subscribe({
            next: () => {
              offer.isFavorite = !offer.isFavorite;
              this.toastService.success(
                `${offer.name} successfully removed from favorites!`
              );
            },
          });
        } else {
          this.favoriteService.deleteFavoriteProduct(temp, offer.id).subscribe({
            next: () => {
              offer.isFavorite = !offer.isFavorite;
              this.toastService.success(
                `${offer.name} successfully removed from favorites!`
              );
            },
          });
        }
      } else {
        this.favoriteOffer.offeringId = offer.id;
        if (offer.isService) {
          this.favoriteService
            .addFavoriteService(temp, this.favoriteOffer)
            .subscribe({
              next: () => {
                offer.isFavorite = !offer.isFavorite;
                this.toastService.success(
                  `${offer.name} successfully added to favorites!`
                );
              },
            });
        } else {
          this.favoriteService
            .addFavoriteProduct(temp, this.favoriteOffer)
            .subscribe({
              next: () => {
                offer.isFavorite = !offer.isFavorite;
                this.toastService.success(
                  `${offer.name} successfully added to favorites!`
                );
              },
            });
        }
      }
    }
  }
}
