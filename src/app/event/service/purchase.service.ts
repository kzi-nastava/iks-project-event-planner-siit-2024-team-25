import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { ProductPurchaseResponseDTO } from '../model/product-purchase-response';
import { ServicePurchaseCard } from '../model/service-purchase-card.model';
import { PurchasePreview } from '../model/purchase-preview.mode';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private datePipe: DatePipe,
  ) {}

  purchaseProduct(
    eventId: number,
    productId: number,
  ): Observable<ProductPurchaseResponseDTO> {
    const dto = { productId: productId };
    return this.httpClient.post<ProductPurchaseResponseDTO>(
      environment.apiHost + '/api/purchase/events/' + eventId + '/products',
      dto,
    );
  }

  getPurchaseByEvent(eventId:number): Observable<PurchasePreview[]>{
    return this.httpClient.get<PurchasePreview[]>(environment.apiHost + "/api/purchase/" + eventId);
  }

  getOwnerPurchases(
    startDate: Date,
    endDate: Date,
  ): Observable<ServicePurchaseCard[]> {
    const userId = this.authService.getUser()!.userId;
    return this.httpClient.get<ServicePurchaseCard[]>(
      environment.apiHost + `/api/purchase/`,
      {
        params: {
          ownerId: userId,
          startDate: this.datePipe.transform(startDate, 'yyyy-MM-dd')!,
          endDate: this.datePipe.transform(endDate, 'yyyy-MM-dd')!,
        },
      },
    );
  }
}
