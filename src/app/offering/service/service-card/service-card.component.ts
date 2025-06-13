import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Service } from '../model/service';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDialogComponent } from '../service-dialog/service-dialog.component';
import { ServiceDialogInformationComponent } from '../service-dialog/service-dialog-information.component';
import { OfferingServiceService } from '../offering-service.service';
import { Router } from '@angular/router';
import { ErrorDialogComponent } from '../../../shared/error-dialog/error-dialog.component';
import { ErrorResponse } from '../../../shared/model/error.response.model';

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
  refresh= new EventEmitter<Boolean>();

  openEditPage(event:Event, id: number){
    event.stopPropagation();
    this.router.navigate(['/service/serviceForm', this.service.id]);
  }

  openDialog(event: Event, s: Service) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ServiceDialogComponent, {
      data: {
        serviceName: s.name,
        serviceId: s.id
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.response === 'yes') {
        this.serviceMenager.deleteService(result.serviceId).subscribe({
          next:()=>{
            this.refresh.emit();
            const dialogTemp = this.dialog.open(ServiceDialogInformationComponent, {
              data: {
                message: result.serviceName + ' is deleted',
              }
            })
            
          },
          error:(err : ErrorResponse)=>{
            const dialogRef = this.dialog.open(ErrorDialogComponent, {
              data: {
                message: err.message
              },
            });
          }
        })
        
      }
    });
  }

}
