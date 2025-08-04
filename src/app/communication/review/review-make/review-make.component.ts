import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ServiceDialogInformationComponent } from '../../../offering/service/service-dialog/service-dialog-information.component';

@Component({
  selector: 'app-review-make',
  templateUrl: './review-make.component.html',
  styleUrl: './review-make.component.scss'
})
export class ReviewMakeComponent {
  comment: string = '';
  rating: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];

  constructor(public dialogRef: MatDialogRef<ReviewMakeComponent>, public dialog: MatDialog,) {}

  setRating(rating: number) {
    this.rating = rating;
  }

  isFormValid(): boolean {
    return this.comment.trim() !== '' && this.rating > 0;
  }

  submit() {
    this.dialogRef.close({ comment: this.comment, rating: this.rating });
    this.dialog.open(ServiceDialogInformationComponent, {
          data: {
            message: "You successfully made review!"
          },
        });
  }
}
