import { Component, EventEmitter, Output } from '@angular/core';
import { Service } from '../model/service.model';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDialogComponent } from '../service-dialog/service-dialog.component';
import { ServiceDialogInformationComponent } from '../service-dialog/service-dialog-information.component';

@Component({
  selector: 'app-list-services',
  templateUrl: './list-services.component.html',
  styleUrl: './list-services.component.scss'
})
export class ListServicesComponent {
  constructor(public dialog:MatDialog){}

    services = [
      new Service('Service 1', 'Desc 1', 1),
      new Service('Service 2', 'Desc 2', 2),
      new Service('Service 3', 'Desc 3', 3),
      new Service('Service 4', 'Desc 4', 4)
    ]
    isFilter:boolean = false;
    options: string[] = ['One', 'Two', 'Three'];

    @Output() toggle = new EventEmitter<void>();
    filteredServices = [...this.services];

    openDialog(){
      const dialogRef = this.dialog.open(ServiceDialogComponent,{
        data: {
          serviceName: this.services[0].name
        },
      });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.response === 'yes') {
        console.log(result)
        this.dialog.open(ServiceDialogInformationComponent,{
          data:{
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

    clickFilter(){
      this.isFilter = !this.isFilter;
    }
}


