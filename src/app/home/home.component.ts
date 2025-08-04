import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None 
})
export class HomeComponent {

  homeTitle = "WELCOME";

  currentContainer: String = "E";

  switchDisplay(container: String): void {
    if (container === 'EVENTS') {
      this.currentContainer = 'E';
    } else if (container === 'PRODUCTS & SERVICES') {
      this.currentContainer = 'O';
    }
  }

}
