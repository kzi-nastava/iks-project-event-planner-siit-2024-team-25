import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  title = '404 - Page Not Found';
  message = 'Oops! The page you are looking for does not exist.';

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
