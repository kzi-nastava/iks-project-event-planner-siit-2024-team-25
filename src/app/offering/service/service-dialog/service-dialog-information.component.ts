import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-service-dialog-information',
  templateUrl: './service-dialog-information.component.html',
  styleUrl: './service-dialog-information.component.scss'
})
export class ServiceDialogInformationComponent {

  constructor(
    public dialogRef: MatDialogRef<ServiceDialogInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
