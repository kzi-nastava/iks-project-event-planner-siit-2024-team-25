import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../model/product.model';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { ProductDialogInformationComponent } from '../product-information-dialog/product-information-dialog.component';
import { ProductService } from '../service/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  constructor(
    public dialog: MatDialog,
    private productService: ProductService,
    private router: Router,
  ) {}

  @Input()
  product!: Product;

  @Output()
  refresh = new EventEmitter<Boolean>();

  openEditPage(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/products', this.product.id, 'edit']);
  }

  openDialog(event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      data: {
        productName: this.product.name,
        productId: this.product.id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.response === 'yes') {
        this.productService.deleteProduct(result.productId).subscribe({
          next: () => {
            this.refresh.emit();
            this.dialog.open(ProductDialogInformationComponent, {
              data: {
                productName: result.productName,
                action: 'deleted',
              },
            });
          },
          error: (_) => {
            console.log('error');
          },
        });
      }
    });
  }
}
