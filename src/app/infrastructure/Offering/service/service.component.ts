import { Component } from '@angular/core';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent {
  showForm = false;
  toForm(){
    console.log(this.showForm)
    this.showForm = !this.showForm;
    console.log(this.showForm)
  }
}
