import { Injectable } from '@angular/core';
import { HomeOffering } from '../model/homeOfferings';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfferingService {

  private currentTopOfferings: HomeOffering[] = [];
  private currentOfferings: HomeOffering[] = []

  constructor() { }

  getTopOfferings(): Observable<HomeOffering[]> {
    this.currentTopOfferings = [
      {
        id: 1,
        name: 'Event Photography',
        location: 'Uzice',
        ownerName: 'Stefan',
        isFavourite: false,
        price: 1500,
        description: 'Professional photography services for events, capturing memorable moments.',
        rating: 5.0
      },
      {
        id: 2,
        name: 'Party Decorations',
        location: 'Uzice',
        ownerName: 'Stefan',
        isFavourite: false,
        price: 800,
        description: 'Custom event decorations to match the theme of your celebration.',
        rating: 5.0
      },
      {
        id: 3,
        name: 'Live Band Performance',
        location: 'Uzice',
        ownerName: 'Stefan',
        isFavourite: false,
        price: 3000,
        description: 'Live band performances for weddings, corporate events, and parties.',
        rating: 5.0
      },
      {
        id: 4,
        name: 'Wedding Catering',
        location: 'Uzice',
        ownerName: 'Stefan',
        isFavourite: false,
        price: 2500,
        description: 'Complete catering service for weddings, including a variety of dishes and drinks.',
        rating: 5.0

      },
      {
        id: 5,
        name: 'Transportation Services',
        location: 'Uzice',
        ownerName: 'Stefan',
        isFavourite: false,
        price: 1000,
        description: 'Transportation services for guests, including shuttle buses and luxury cars.',
        rating: 5.0
      }
    ];
    return of(this.currentTopOfferings);
  }



  getOfferings(page: number){
    this.currentOfferings = [
      {
        id: 1,
        name: 'Event Photography',
        location: 'Uzice',
        ownerName: 'Stefan',
        isFavourite: false,
        price: 1500,
        description: 'Professional photography services for events, capturing memorable moments.',
        rating: 5.0
      },
      {
        id: 2,
        name: 'Party Decorations',
        location: 'Uzice',
        ownerName: 'Stefan',
        isFavourite: false,
        price: 800,
        description: 'Custom event decorations to match the theme of your celebration.',
        rating: 5.0
      },
      {
        id: 3,
        name: 'Live Band Performance',
        location: 'Uzice',
        ownerName: 'Stefan',
        isFavourite: false,
        price: 3000,
        description: 'Live band performances for weddings, corporate events, and parties.',
        rating: 5.0
      },
      {
        id: 4,
        name: 'Wedding Catering',
        location: 'Uzice',
        ownerName: 'Stefan',
        isFavourite: false,
        price: 2500,
        description: 'Complete catering service for weddings, including a variety of dishes and drinks.',
        rating: 5.0

      },
      {
        id: 5,
        name: 'Transportation Services',
        location: 'Uzice',
        ownerName: 'Stefan',
        isFavourite: false,
        price: 1000,
        description: 'Transportation services for guests, including shuttle buses and luxury cars.',
        rating: 5.0
      },
      {
        id: 6,
        name: 'Event Photography',
        location: 'Uzice',
        ownerName: 'Stefan',
        isFavourite: false,
        price: 1500,
        description: 'Professional photography services for events, capturing memorable moments.',
        rating: 5.0
      },
      {
        id: 7,
        name: 'Party Decorations',
        location: 'Uzice',
        ownerName: 'Stefan',
        isFavourite: false,
        price: 800,
        description: 'Custom event decorations to match the theme of your celebration.',
        rating: 5.0
      },
      {
        id: 8,
        name: 'Live Band Performance',
        location: 'Uzice',
        ownerName: 'Stefan',
        isFavourite: false,
        price: 3000,
        description: 'Live band performances for weddings, corporate events, and parties.',
        rating: 5.0
      },
      {
        id: 9,
        name: 'Wedding Catering',
        location: 'Uzice',
        ownerName: 'Stefan',
        isFavourite: false,
        price: 2500,
        description: 'Complete catering service for weddings, including a variety of dishes and drinks.',
        rating: 5.0

      },
      {
        id: 10,
        name: 'Transportation Services',
        location: 'Uzice',
        ownerName: 'Stefan',
        isFavourite: false,
        price: 1000,
        description: 'Transportation services for guests, including shuttle buses and luxury cars.',
        rating: 5.0
      }
    ];
    return of(this.currentOfferings);
  }

  toggleFavouriteOfferings(offeringId: number): void {
    let offering = this.currentTopOfferings.find(o => o.id === offeringId);
    if (offering) {
      offering.isFavourite = !offering.isFavourite; 
    }
    offering = this.currentOfferings.find(o => o.id === offeringId); 
      if(offering){
        offering .isFavourite = !offering.isFavourite;
      }
  }
}
