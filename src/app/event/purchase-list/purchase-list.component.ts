import { Component, OnInit } from '@angular/core';
import { PurchasePreview } from '../model/purchase-preview.mode';
import { PurchaseService } from '../service/purchase.service';
import { ReviewMakeComponent } from '../../communication/review/review-make/review-make.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.scss'
})
export class PurchaseListComponent implements OnInit{
  displayedColumns = ['position', 'name', 'price', 'review'];
  purchaseList: PurchasePreview[] = [];
  eventId: number | any = null;

  constructor(private purchaseService: PurchaseService, private dialog: MatDialog){}
  ngOnInit(): void {
    const eventFromState = window.history.state['eventId'];
    if (eventFromState) {
      this.eventId = eventFromState;
    }else{
      console.log("event id not found")
    }
    this.getPurchaseList();
  }

  getPurchaseList(){
    this.purchaseService.getPurchaseByEvent(this.eventId).subscribe({
      next:(res)=>{
        this.purchaseList = res;
      },
      error:()=>{
        console.log("error")
      }
    })
  }
  makeReview(purchase: PurchasePreview){
    const dialogRef = this.dialog.open(ReviewMakeComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Review submitted:', result);
      }
    });
  }
}
