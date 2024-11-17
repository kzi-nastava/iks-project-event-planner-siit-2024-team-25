import { Component } from '@angular/core';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent {
  showForm = true;
  toForm(){
    this.showForm = !this.showForm;
  }
}
