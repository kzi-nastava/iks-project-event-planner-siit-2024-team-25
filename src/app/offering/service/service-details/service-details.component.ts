import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { UserRole } from '../../../infrastructure/auth/model/user-role.model';
import { Service } from '../model/service';
import { OfferingServiceService } from '../offering-service.service';
import { BookServiceDialogComponent } from '../book-service-dialog/book-service-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.scss',
})
export class ServiceDetailsComponent {
  serviceId!: number;
  showButton: boolean = false;
  service!: Service;
  eventId!: number;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private serviceService: OfferingServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.getUser()?.role == UserRole.EventOrganizer) {
      this.showButton = true;
    }
    // Getting 'id' from URL-a
    this.route.params.subscribe((params) => {
      this.serviceId = +params['id'];

      this.serviceService.getServiceById(+params['id']).subscribe({
        next: (service: Service) => {
          this.service = service;
        },
      });
    });

    // Dobavljanje query parametara
    this.route.queryParams.subscribe((queryParams) => {
      this.eventId = queryParams['eventId'];
    });
  }

  openBookServiceForm() {
    this.router.navigate(['/services/' + this.service.id + '/purchase/'], {
      queryParams: { eventId: this.eventId },
    });
  }
}
