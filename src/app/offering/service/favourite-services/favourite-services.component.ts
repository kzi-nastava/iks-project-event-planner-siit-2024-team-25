import { Component, OnInit } from '@angular/core';
import { FavouriteOfferingsService } from '../../services/favourite-offerings.service';
import { Service } from '../model/service';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { HomeOffering } from '../../model/home-offering.model';

@Component({
  selector: 'app-favourite-services',
  templateUrl: './favourite-services.component.html',
  styleUrl: './favourite-services.component.scss'
})
export class FavouriteServicesComponent implements OnInit{

  loading = true;
  services: HomeOffering[] = []
  constructor(private favoriteService: FavouriteOfferingsService, private authService: AuthService){

  }
  ngOnInit(): void {
    this.getServices();
  }

  getServices(){
    const temp = this.authService.getUser()?.userId;
    if(temp){
      this.favoriteService.getFavoriteService(temp).subscribe({
        next:(res)=>{
          this.services = res;
          this.loading= false;
        }
    })
    }
    
  }
}
