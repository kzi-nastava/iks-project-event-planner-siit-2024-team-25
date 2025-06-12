import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HomeOffering } from '../model/home-offering.model';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../infrastructure/auth/service/auth.service';

@Component({
  selector: 'app-home-offering-card',
  templateUrl: './home-offering-card.component.html',
  styleUrl: './home-offering-card.component.scss',
})
export class HomeOfferingCardComponent implements OnInit{
  @Input()
  offering!: HomeOffering;

  @Output()
  clickedFav: EventEmitter<HomeOffering> = new EventEmitter<HomeOffering>();

  showHeart: boolean = false;
  changeFavouriteOffering(): void {
    this.clickedFav.emit(this.offering);
  }

  constructor(private decimalPipe: DecimalPipe, private router: Router, private authService: AuthService) {}
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
    if (this.offering.isService) {
      this.router.navigateByUrl('/service/services/' + this.offering.id);
    } else {
      this.router.navigateByUrl('/products/' + this.offering.id);
    }
  }
}
