import { Component } from '@angular/core';
import { HomeOffering } from '../../model/home-offering.model';
import { FavouriteOffering } from '../../model/favorite-offering.model';
import { FavouriteOfferingsService } from '../../services/favourite-offerings.service';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-favourite-product',
  templateUrl: './favourite-product.component.html',
  styleUrl: './favourite-product.component.scss',
})
export class FavouriteProductComponent {
  loading = true;
  products: HomeOffering[] = [];
  favoriteOffer: FavouriteOffering = {
    offeringId: -1,
  };
  constructor(
    private favoriteService: FavouriteOfferingsService,
    private authService: AuthService,
    private toastService: ToastrService
  ) {}
  ngOnInit(): void {
    this.getProducts();
  }
  getProducts() {
    const temp = this.authService.getUser()?.userId;
    if (temp) {
      this.favoriteService.getFavoriteProducts(temp).subscribe({
        next: (res) => {
          this.products = res;
          this.loading = false;
        },
      });
    }
  }

  removeFromFav(offer: HomeOffering) {
    const temp = this.authService.getUser()?.userId;
    if (temp) {
      this.favoriteService.deleteFavoriteProduct(temp, offer.id).subscribe({
        next: () => {
          offer.isFavourite = false;
          this.toastService.success(
            `${offer.name} successfully removed from favorites!`
          );

          this.getProducts();
        },
        error: () => {
          this.toastService.error(
            'Error',
            `Failed to remove ${offer.name} from favorite products...`
          );
        },
      });
    }
  }
}
