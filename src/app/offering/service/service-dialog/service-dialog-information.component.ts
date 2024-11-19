import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-service-dialog-information',
  templateUrl: './service-dialog-information.component.html',
  styleUrl: './service-dialog-information.component.scss'
})
export class ServiceDialogInformationComponent {

  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: { serviceName:string, action:string }
  ) {}

}
