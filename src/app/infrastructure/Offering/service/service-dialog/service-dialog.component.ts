import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-service-dialog',
  templateUrl: './service-dialog.component.html',
  styleUrl: './service-dialog.component.scss'
})
export class ServiceDialogComponent {
  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: { serviceName:string }
  ) {}

  onYesClick(): void {
    this.dialogRef.close({response:"yes",serviceName: this.data.serviceName}); // Vraća true za potvrdu
  }

  onNoClick(): void {
    this.dialogRef.close("no"); // Vraća false za odbijanje
  }
}
