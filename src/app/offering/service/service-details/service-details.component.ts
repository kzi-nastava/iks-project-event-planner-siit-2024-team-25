import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.scss'
})
export class ServiceDetailsComponent {
  serviceId!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Getting 'id' from URL-a
    this.route.params.subscribe(params => {
      this.serviceId = +params['id'];
    });
  }
}
