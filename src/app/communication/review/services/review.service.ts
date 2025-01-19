import { Injectable } from '@angular/core';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Review } from '../model/review-model';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Page } from '../../../shared/model/page.mode';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(
        private httpClient: HttpClient) { }

  postReview(review:Review):Observable<Review>{
    return this.httpClient.post<Review>(environment.apiHost + `/api/reviews`, review);
  }

  getEventReviewsByOrganizer(currentPage:number):Observable<{
    reviews:Review[],
    totalReviews:number,
    totalPages:number 
  }>{
    let param = new HttpParams();
    param = param.set("eventsReviews", true);
    param = param.set('page', currentPage);
    return this.httpClient.get<Page<Review>>(environment.apiHost+`/api/reviews`, {params:param}).pipe(
      map((page)=>({
        reviews:page.content,
        totalReviews:page.totalElements,
        totalPages:page.totalPages
      }))
    );
  }
  getOfferingReviewsByOwner(currentPage:number):Observable<{
    reviews:Review[],
  totalReviews:number,
  totalPages:number  
  }>{
    let param = new HttpParams();
    param = param.set("offeringsReviews", true);
    param = param.set('page', currentPage);
    return this.httpClient.get<Page<Review>>(environment.apiHost+`/api/reviews`, {params:param}).pipe(
      map((page)=>({
        reviews:page.content,
        totalReviews:page.totalElements,
        totalPages:page.totalPages
      }))
    );
  }
}
