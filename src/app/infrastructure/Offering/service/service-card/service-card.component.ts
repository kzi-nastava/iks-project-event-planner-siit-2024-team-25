import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Service } from '../model/service';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDialogComponent } from '../service-dialog/service-dialog.component';
import { ServiceDialogInformationComponent } from '../service-dialog/service-dialog-information.component';
import { OfferingServiceService } from '../offering-service.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent{
  
  constructor(public dialog: MatDialog, private serviceMenager: OfferingServiceService, private router: Router){}

  @Input()
  service!: Service;

  @Output()
  clickedService: EventEmitter<Service> = new EventEmitter<Service>();


  onWineClicked(): void {
    this.clickedService.emit(this.service)
  }

  openEditPage(event:Event, id: number){
    event.stopPropagation();
    console.log('Service you clicked: ');
    console.log(this.serviceMenager.getServiceById(id));
    this.router.navigate(['/serviceEditForm', this.service.id]);
  }

  openDialog(event: Event, s: Service) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ServiceDialogComponent, {
      data: {
        serviceName: s.name
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

}
