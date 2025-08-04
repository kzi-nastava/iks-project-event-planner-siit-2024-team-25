import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-service-dialog',
  templateUrl: './service-dialog.component.html',
  styleUrl: './service-dialog.component.scss'
})
export class ServiceDialogComponent {
  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: { serviceName:string, serviceId:number }
  ) {}

  onYesClick(): void {
    this.dialogRef.close({response:"yes",serviceName: this.data.serviceName, serviceId: this.data.serviceId}); 
  }

  onNoClick(): void {
    this.dialogRef.close("no"); 
  }
}
