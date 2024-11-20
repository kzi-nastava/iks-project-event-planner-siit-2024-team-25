import { Component, OnInit, ViewChild } from '@angular/core';
import { Service } from '../model/service';
import { ServiceDialogComponent } from '../service-dialog/service-dialog.component';
import { ServiceDialogInformationComponent } from '../service-dialog/service-dialog-information.component';
import { OfferingServiceService } from '../offering-service.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list-services',
  templateUrl: './list-services.component.html',
  styleUrl: './list-services.component.scss'
})
export class ListServicesComponent implements OnInit {

  services: Service[] = [];
  filteredServices: Service[] = [];
  clickedService: String = "";
  isFilter: boolean = false;
  options: string[] = ['One', 'Two', 'Three'];
  
    constructor(private serviceManage: OfferingServiceService, private router: Router) { }
  
    ngOnInit(): void {
      this.getAll();
      console.log(this.services)
    }
  
    getAll():void{
      this.serviceManage.getAll().subscribe({
        next: (services: Service[]) => {
          this.services = services;
        },
        error: (_) => {
          console.log("Greska!")
        }
      })
      this.filteredServices = [...this.services];
    }

  onServiceClicked(s: Service) {
    this.clickedService = s.name;
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value || '';
    this.filteredServices = this.services.filter(service =>
      service.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  clickFilter() {
    this.isFilter = !this.isFilter;
  }

  goToCreateService(){
    this.router.navigate(['/service/serviceForm'])
  }
}


