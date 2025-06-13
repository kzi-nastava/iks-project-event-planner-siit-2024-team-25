import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from '../../../event/service/purchase.service';
import { UserRole } from '../../../infrastructure/auth/model/user-role.model';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { ErrorDialogComponent } from '../../../shared/error-dialog/error-dialog.component';
import { ErrorResponse } from '../../../shared/model/error.response.model';
import { ServiceDialogInformationComponent } from '../../service/service-dialog/service-dialog-information.component';
import { Product } from '../model/product.model';
import { ProductService } from '../service/product.service';
import { ReviewType } from '../../../communication/review/model/review-type';
import { FavouriteOfferingsService } from '../../services/favourite-offerings.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  changeFavouriteOffering() {
    const temp = this.authService.getUser()?.userId;
    if (temp) {
      if (this.product.isFavorite) {
        this.favoriteService
          .deleteFavoriteProduct(temp, this.product.id)
          .subscribe({
            next: () => {
              this.product.isFavorite = false;
              this.toastService.success(
                `${this.product.name} successfully removed from favorites!`
              );
            },
            error: () => {
              this.toastService.error(
                'Error',
                `Failed to remove ${this.product.name} from favorite products...`
              );
            },
          });
      } else {
        this.favoriteService
          .addFavoriteProduct(temp, { offeringId: this.product.id })
          .subscribe({
            next: () => {
              this.product.isFavorite = true;
              this.toastService.success(
                `${this.product.name} successfully added to favorites!`
              );
            },
            error: () => {
              this.toastService.error(
                'Error',
                `Failed to add ${this.product.name} from favorite products...`
              );
            },
          });
      }
    }
  }
  currentSlide = 0;
  errorResponse!: ErrorResponse;

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.product.images.length;
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.product.images.length) %
      this.product.images.length;
  }
  productId!: number;
  showPurchaseProductButton: boolean = false;
  product!: Product;
  eventId!: number;

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private purchaseService: PurchaseService,
    private productService: ProductService,
    private favoriteService: FavouriteOfferingsService,
    private toastService: ToastrService
  ) {}

  showChatButton: boolean = true;
  showOwnerCompanyButton: boolean = true;
  showPurchaseListButton: boolean = true;
  showReviewsButton: boolean = true;
  ngOnInit(): void {
    if (this.authService.getUser()?.role == UserRole.EventOrganizer) {
      this.showPurchaseProductButton = true;
    }
    this.route.params.subscribe((params) => {
      this.productId = +params['id'];

      this.productService.getProductById(this.productId).subscribe({
        next: (res: Product) => {
          this.product = res;
          console.log(res);
        },
        error: (_) => {
          console.log('error');
        },
      });
    });

    this.route.queryParams.subscribe((queryParams) => {
      this.eventId = queryParams['eventId'];
    });
    if (this.authService.getUser()) {
      if (this.authService.getUser()?.role == UserRole.Regular) {
        this.showChatButton = false;
        this.showPurchaseListButton = false;
      } else if (this.authService.getUser()?.role == UserRole.EventOrganizer) {
      } else if (this.authService.getUser()?.role == UserRole.Owner) {
        this.showChatButton = false;
      } else if (this.authService.getUser()?.role == UserRole.Admin) {
        this.showChatButton = false;
        this.showPurchaseListButton = false;
      } else {
        this.showChatButton = false;
        this.showPurchaseListButton = false;
      }
    } else {
      this.showChatButton = false;
      this.showPurchaseListButton = false;
    }
  }

  purchaseProduct() {
    if (this.eventId == null) {
      this.dialog.open(ErrorDialogComponent, {
        data: {
          message: 'You must buy product for some event',
        },
      });
      return;
    }
    this.purchaseService
      .purchaseProduct(this.eventId, this.productId)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.dialog.open(ServiceDialogInformationComponent, {
            data: {
              message:
                'Congrats, ' + this.product.name + ' is successfully bought',
            },
          });
        },
        error: (err) => {
          this.errorResponse = err.error;
          this.dialog.open(ErrorDialogComponent, {
            data: {
              message: this.errorResponse.message,
            },
          });
        },
      });
  }

  viewOwnerCompany() {
    console.log(this.product.ownerInfo.id);
    this.router.navigate(['/user', this.product.ownerInfo.id]);
  }
  openPurchaseList() {
    this.router.navigate([`event/${this.productId}/purchases`], {
      state: {
        offeringId: this.productId,
        reviewType: ReviewType.EVENT_REVIEW,
      },
    });
  }
  openReviews() {
    this.router.navigate([`/chat/offering-event`], {
      state: {
        offeringId: this.product.id,
        eventOfferingName: this.product.name,
      },
    });
  }
}
