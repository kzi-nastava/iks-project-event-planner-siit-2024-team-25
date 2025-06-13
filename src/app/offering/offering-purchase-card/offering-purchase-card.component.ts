import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HomeOffering } from '../model/home-offering.model';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../infrastructure/auth/service/auth.service';

@Component({
  selector: 'app-offering-purchase-card',
  templateUrl: './offering-purchase-card.component.html',
  styleUrl: './offering-purchase-card.component.scss',
})
export class OfferingPurchaseCardComponent implements OnInit{
  @Input()
  offering!: HomeOffering;

  @Input()
  eventId!: number;

  @Output()
  clicked: EventEmitter<HomeOffering> = new EventEmitter<HomeOffering>();

  changeFavouriteOffering(): void {
    this.clicked.emit(this.offering);
  }
  showHeart: boolean = true;

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

  openServiceBookDialog(): void {
    if(this.offering.isService){
this.router.navigate(['/service/services/' + this.offering.id], {
      queryParams: { eventId: this.eventId },
    });
    }else{
this.router.navigate(['/products/' + this.offering.id], {
      queryParams: { eventId: this.eventId },
    });
    }
    
  }
}
