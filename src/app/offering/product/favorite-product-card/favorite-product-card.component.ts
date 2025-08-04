import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HomeOffering } from '../../model/home-offering.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';

@Component({
  selector: 'app-favorite-product-card',
  templateUrl: './favorite-product-card.component.html',
  styleUrl: './favorite-product-card.component.scss',
  providers: [DecimalPipe],
})
export class FavoriteProductCardComponent {
  @Input()
  offering!: HomeOffering;

  @Output()
  clickedFav: EventEmitter<HomeOffering> = new EventEmitter<HomeOffering>();

  showHeart: boolean = false;
  changeFavouriteOffering(): void {
    this.clickedFav.emit(this.offering);
  }
  constructor(
    private decimalPipe: DecimalPipe,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.showHeart = this.authService.getUser() != null ? true : false;
  }
  formatRating(rating: number): string {
    return this.decimalPipe.transform(rating, '1.1') || '';
  }

  formatLocation(country: string, city: string) {
    return country + ',' + city;
  }

  showMoreDetails() {
    this.router.navigateByUrl('/products/' + this.offering.id);
  }
}
