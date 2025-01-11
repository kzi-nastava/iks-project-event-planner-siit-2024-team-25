import { Component, OnInit } from '@angular/core';
import { Product } from '../model/product.model';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { UserRole } from '../../../infrastructure/auth/model/user-role.model';
import { ServiceDialogInformationComponent } from '../../service/service-dialog/service-dialog-information.component';
import { ErrorDialogComponent } from '../../../shared/error-dialog/error-dialog.component';
import { PurchaseService } from '../../../event/service/purchase.service';
import { ErrorResponse } from '../../../shared/model/error.response.model';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
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
  ) {}

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
  }

  purchaseProduct() {
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
    this.router.navigate(['/user', this.product.ownerInfo.id, 'information']);
    throw new Error('Method not implemented.');
  }


}
