import { Component, OnInit } from '@angular/core';
import { FavouriteOfferingsService } from '../../services/favourite-offerings.service';
import { Service } from '../model/service';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { HomeOffering } from '../../model/home-offering.model';
import { of } from 'rxjs';
import { FavouriteOffering } from '../../model/favorite-offering.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-favourite-services',
  templateUrl: './favourite-services.component.html',
  styleUrl: './favourite-services.component.scss',
})
export class FavouriteServicesComponent implements OnInit {
  loading = true;
  services: HomeOffering[] = [];
  favoriteOffer: FavouriteOffering = {
    offeringId: -1,
  };
  constructor(
    private favoriteService: FavouriteOfferingsService,
    private authService: AuthService,
    private toastService: ToastrService
  ) {}
  ngOnInit(): void {
    this.getServices();
  }

  getServices() {
    const temp = this.authService.getUser()?.userId;
    if (temp) {
      this.favoriteService.getFavoriteService(temp).subscribe({
        next: (res) => {
          this.services = res;
          this.loading = false;
        },
      });
    }
  }
  favoriteChanged(offer: HomeOffering) {
    const temp = this.authService.getUser()?.userId;
    if (temp) {
      this.favoriteService.deleteFavoriteService(temp, offer.id).subscribe({
        next: () => {
          offer.isFavorite = false;
          this.toastService.success(
            `${offer.name} successfully removed from favorites!`
          );

          this.getServices();
        },
        error: () => {
          this.toastService.error(
            'Error',
            `Failed to remove ${offer.name} from favorite services...`
          );
        },
      });
    }
  }
}
