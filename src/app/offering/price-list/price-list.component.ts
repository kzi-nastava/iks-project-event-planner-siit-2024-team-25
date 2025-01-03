import { Component, OnInit } from '@angular/core';
import { UserRole } from '../../infrastructure/auth/model/user-role.model';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { PriceListService } from '../services/price-list.service';
import { PriceListItem } from '../model/price-list-mode';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { PriceListEditDialogComponent } from '../price-list-edit-dialog/price-list-edit-dialog.component';
import { PriceListItemRequest } from '../model/price-list-requestDTO';
import { ErrorDialogComponent } from '../../shared/error-dialog/error-dialog.component';
import { catchError, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrl: './price-list.component.scss'
})
export class PriceListComponent implements OnInit {

  isLoading: boolean = false;
  requestEditDTO : PriceListItemRequest = {price:0, discount:0};
  ownerId?: number;
  isProductList = true;
  priceListItems: PriceListItem[] = []
  displayedColumns = ['position','name', 'price', 'discount', 'priceWithDiscount','edit'];

  constructor(
    private authService: AuthService,
    private priceListService: PriceListService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.ownerId = this.authService.getUser()?.userId
    console.log(this.ownerId)
    if (this.ownerId != null) {
      this.getPriceList();
    }
    else{
      console.log("error")//open error page
    }
  }

  getPriceList(){
    this.priceListItems = []
    if(this.isProductList){
      this.priceListService.getProductsPriceList(this.ownerId).subscribe({
        next: (res)=>{
          this.isLoading = false;
          this.priceListItems = res;
        },
        error: (_) =>{
          this.isLoading = false;
          console.log("error")
        }
      })
    }else{
      this.priceListService.getServicesPriceList(this.ownerId).subscribe({
        next: (res)=>{
          this.isLoading = false;
          this.priceListItems = res;
        },
        error: (_) =>{
          this.isLoading = false;
          console.log("error")
        }
      })
    }
  }
  

  onOfferingChange(event: MatTabChangeEvent) {
    console.log("asd")
    if (event.index === 0) {
      this.isProductList = true
    } else{
      this.isProductList = false;
    } 
    this.getPriceList();
  }

  onEditOffering(price: number, discount:number, offeringId:number){
    const dialogRef = this.dialog.open(PriceListEditDialogComponent, {
      width: '40rem',
      data: { price:price, discount:discount },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.requestEditDTO.price = result.price;
        this.requestEditDTO.discount = result.discount;
        this.priceListService.updatePriceListItem(offeringId, this.requestEditDTO).subscribe({
          next:(res)=>{
            this.getPriceList();
          },
          error:(_)=>{
            this.isLoading = false;
            this.dialog.open(ErrorDialogComponent),{
              message: "Server error"
            }
          }
        })
      }
    });
  }
}
