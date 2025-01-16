import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRole } from '../../../infrastructure/auth/model/user-role.model';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { ErrorDialogComponent } from '../../../shared/error-dialog/error-dialog.component';
import { Service } from '../model/service';
import { OfferingServiceService } from '../offering-service.service';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.scss',
})
export class ServiceDetailsComponent {
  currentSlide = 0;
  durationShow = true;

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.service.images.length;
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.service.images.length) %
      this.service.images.length;
  }
  serviceId!: number;
  showBookServiceButton: boolean = false;
  service!: Service;
  eventId!: number;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private serviceService: OfferingServiceService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.authService.getUser()?.role == UserRole.EventOrganizer) {
      this.showBookServiceButton = true;
    }
    // Getting 'id' from URL-a
    this.route.params.subscribe((params) => {
      this.serviceId = +params['id'];

      this.serviceService.getServiceById(+params['id']).subscribe({
        next: (service: Service) => {
          console.log(service);
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
    if (this.service.available) {
      this.router.navigate(['/services/' + this.service.id + '/purchase/'], {
        queryParams: { eventId: this.eventId },
      });
    } else {
      this.dialog.open(ErrorDialogComponent, {
        data: {
          message: this.service.name + 'currently is not available',
        },
      });
    }
  }

  viewOwnerCompany() {
    console.log(this.service.owner.id);
    this.router.navigate(['/user', this.service.owner.id]);
  }
  chatWithOwner() {
    throw new Error('Method not implemented.');
  }
}
