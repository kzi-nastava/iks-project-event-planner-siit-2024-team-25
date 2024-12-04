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

  pageProperties = {
    name: "",
    price: 0,
    availableFilter: false,
    available: false
  }

  services: Service[] = [];
  clickedService: String = "";
  isFilter: boolean = false;
  options: string[] = ['One', 'Two', 'Three'];

  nameFilter: string = "";
  priceFIlter: number = 0;
  availableFilter: boolean = false;
  setAvailableFilter(){
    this.pageProperties.availableFilter = true;
  }

  constructor(private serviceManage: OfferingServiceService, private router: Router) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.serviceManage.getAll(this.pageProperties).subscribe({
      next: (services: Service[]) => {
        this.services = services;
        this.refreshProperites()
      },
      error: (_) => {
        console.log("Greska!")
        this.refreshProperites()
      }
    })
  }

  // get details service page
  onServiceClicked(s: Service) {
    this.clickedService = s.name;
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value || '';
    this.pageProperties.name = query
    this.getAll();
  }

  searchAndFilter(){
    this.pageProperties.name = this.nameFilter.toLocaleLowerCase();
    this.pageProperties.price = this.priceFIlter;
    this.pageProperties.available = this.availableFilter;
    this.getAll();
  }

  refreshProperites(){
    this.pageProperties.name = "";
    this.pageProperties.price = 0;
    this.pageProperties.availableFilter = false;
    this.pageProperties.available = false
  }

  cancelFilter(){
    this.priceFIlter = 0;
    this.nameFilter = "";
    this.availableFilter = false;
    this.refreshProperites();
  }

  clickFilter() {
    this.isFilter = !this.isFilter;
  }

  goToCreateService() {
    this.router.navigate(['/service/serviceForm'])
  }
}


