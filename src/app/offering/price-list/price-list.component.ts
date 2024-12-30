import { Component, OnInit } from '@angular/core';
import { UserRole } from '../../infrastructure/auth/model/user-role.model';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { PriceListService } from '../services/price-list.service';
import { PriceListItem } from '../model/price-list-mode';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrl: './price-list.component.scss'
})
export class PriceListComponent implements OnInit {


  ownerId?: number;
  isProductList = true;
  priceListItems: PriceListItem[] = []
  displayedColumns = ['position','name', 'price', 'discount', 'priceWithDiscount','edit'];

  constructor(
    private authService: AuthService,
    private priceListService: PriceListService,
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
          this.priceListItems = res;
        },
        error: (_) =>{
          console.log("error")
        }
      })
    }else{
      this.priceListService.getServicesPriceList(this.ownerId).subscribe({
        next: (res)=>{
          this.priceListItems = res;
        },
        error: (_) =>{
          console.log("error")
        }
      })
    }
  }

  onOfferingChange(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.isProductList = true
    } else{
      this.isProductList = false;
    } 
    this.getPriceList();
  }

}
