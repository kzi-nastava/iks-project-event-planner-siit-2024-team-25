import { Injectable } from '@angular/core';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Review } from '../model/review-model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(
        private httpClient: HttpClient) { }

  postReview(review:Review):Observable<Review>{
    return this.httpClient.post<Review>(environment.apiHost + `/api/reviews`, review);
  }

  getReviewsByEvent(eventId:number):Observable<Review[]>{
    let param = new HttpParams()
    param = param.set("eventId", eventId)
    return this.httpClient.get<Review[]>(environment.apiHost+`/api/reviews`, {params:param});
  }
}
