import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites-menu',
  templateUrl: './favorites-menu.component.html',
  styleUrls: ['./favorites-menu.component.scss'],
})
export class FavoritesMenuComponent {
  constructor(private router: Router) {}

  navigateToFavorites(type: 'events' | 'offerings'): void {
    const openTab =
      type === 'events' ? 'favorite-events' : 'favorite-offerings';
    this.router.navigate(['/user/profile'], {
      queryParams: { 'open-tab': openTab },
    });
  }
}
