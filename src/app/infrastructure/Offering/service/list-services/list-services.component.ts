import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Service } from '../model/service.model';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDialogComponent } from '../service-dialog/service-dialog.component';
import { ServiceDialogInformationComponent } from '../service-dialog/service-dialog-information.component';
import { OfferingServiceService } from '../offering-service.service';

@Component({
  selector: 'app-list-services',
  templateUrl: './list-services.component.html',
  styleUrl: './list-services.component.scss'
})
export class ListServicesComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  clickedService: string | undefined;
  isFilter: boolean = false;
  options: string[] = ['One', 'Two', 'Three'];

  @Output() toggle = new EventEmitter<void>();

  constructor(public dialog: MatDialog, private serviceManage: OfferingServiceService) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll():void{
    this.services = this.serviceManage.getAll();
    this.filteredServices = [...this.services];
  }


  

  openDialog() {
    const dialogRef = this.dialog.open(ServiceDialogComponent, {
      data: {
        serviceName: this.services[0].name
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.response === 'yes') {
        console.log(result)
        this.dialog.open(ServiceDialogInformationComponent, {
          data: {
            serviceName: result.serviceName,
            action: "deleted"
          }
        })
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value || '';
    this.filteredServices = this.services.filter(service =>
      service.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  onToggle() {
    this.toggle.emit();
  }

  clickFilter() {
    this.isFilter = !this.isFilter;
  }
}


