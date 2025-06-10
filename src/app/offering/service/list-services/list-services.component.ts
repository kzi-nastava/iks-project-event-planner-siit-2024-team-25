import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Service } from '../model/service';
import { ServiceDialogComponent } from '../service-dialog/service-dialog.component';
import { ServiceDialogInformationComponent } from '../service-dialog/service-dialog-information.component';
import { OfferingServiceService } from '../offering-service.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { EventTypeService } from '../../../event/service/event-type.service';
import { OfferingCategoryService } from '../../offering-category/offering-category.service';
import { EventType } from '../../model/event-type';
import { OfferingCategory } from '../../offering-category/model/offering-category';

@Component({
  selector: 'app-list-services',
  templateUrl: './list-services.component.html',
  styleUrl: './list-services.component.scss'
})
export class ListServicesComponent implements OnInit {
  totalPages:number = 1;
  currentPage:number = 0;
  pageProperties = {
    name: "",
    price: 0,
    availableFilter: false,
    available: false,
    eventTypeId: -1,
    offeringCategoryTypeId: -1
  }

  services: Service[] = [];
  clickedService: String = "";
  isFilter: boolean = false;

  // filter fields front
  nameFilter: string = "";
  priceFIlter: number = 0;
  availableFilter: boolean = false;
  selectedEventType:String|undefined = "";
  selectedCategory:String|undefined = ""

  eventTypeAll:Map<number, String> = new Map();
  offeringCategoryTypeAll:Map<number,String> = new Map();

  setAvailableFilter(){
    this.pageProperties.availableFilter = true;
  }

  constructor(private serviceManage: OfferingServiceService, private router: Router, private eventTypeService: EventTypeService,
    private offeringCategoryTypeService: OfferingCategoryService, private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAll(0);
    this.getEventTypes()
    this.getOfferingCategoryTypes()
  }

  getAll(page:number): void {
    this.serviceManage.getAll(page,this.pageProperties).subscribe({
      next: (page) => {
        this.services = page.content;
        this.totalPages = page.totalPages;
        this.refreshProperites()
      },
      error: (_) => {
        console.log("Greska!")
      }
    })
  }

  getEventTypes(){
    this.eventTypeService.getEventTypes().subscribe({
      next:(res:EventType[])=>{
        res.forEach(element => {
          this.eventTypeAll.set(element.id,element.name)
        });
      },
      error:(_)=>{
        console.log("error")
      }
    })
  }

  getOfferingCategoryTypes(){
    this.offeringCategoryTypeService.getAll().subscribe({
      next:(res:OfferingCategory[])=>{
        res.forEach(element => {
          this.offeringCategoryTypeAll.set(element.id,element.name)
        });
      },
      error:(_)=>{
        console.log("error")
      }
    })
  }

  onEventTypeSelected(event: any) {
    const inputValue = event.value;
    this.pageProperties.eventTypeId = inputValue;
    this.selectedEventType = this.eventTypeAll.get(inputValue);
  }
  onCategoryTypeSelected(event:any){
    const inputValue = event.value;
    this.pageProperties.offeringCategoryTypeId = inputValue;
    this.selectedCategory = this.offeringCategoryTypeAll.get(inputValue);
  }

  // get details service page
  onServiceClicked(s: Service) {
    this.clickedService = s.name;
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value || '';
    this.pageProperties.name = query
    this.getAll(0);
  }

  searchAndFilter(){
    this.pageProperties.name = this.nameFilter;
    this.pageProperties.price = this.priceFIlter;
    this.pageProperties.available = this.availableFilter;
    this.getAll(0);
  }

  refreshProperites(){
    this.pageProperties.name = "";
    this.pageProperties.price = 0;
    this.pageProperties.eventTypeId = -1;
    this.pageProperties.offeringCategoryTypeId = -1;
    this.pageProperties.availableFilter = false;
    this.pageProperties.available = false
  }

  cancelFilter(){
    this.priceFIlter = 0;
    this.nameFilter = "";
    this.availableFilter = false;
    this.refreshProperites();
    this.getAll(0)
  }

  clickFilter() {
    this.isFilter = !this.isFilter;
    setTimeout(() => {
    this.cd.detectChanges();
  });
  }

  goToCreateService() {
    this.router.navigate(['/service/serviceForm'])
  }
  getPreviousPage(){
  if (this.currentPage > 0) {
        this.currentPage--;
        this.getAll(this.currentPage);
      }
  }
  getNextPage(){
  
      if (this.currentPage < this.totalPages-1) {
        this.currentPage++;
        this.getAll(this.currentPage);
      }
  }
}


