
import { Injectable } from '@angular/core';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Review } from '../model/review-model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Page } from '../../../shared/model/page.mode';
import { ReviewStatus } from '../model/review-status';
import { ErrorResponse } from '../../../shared/model/error.response.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(
        private httpClient: HttpClient) { }

  postReview(review:Review):Observable<Review>{
    return this.httpClient.post<Review>(environment.apiHost + `/api/reviews`, review);
  }
  getReviewsByEvent(eventId:number, page:number):Observable<{
    reviews:Review[],
    totalReviews: number,
    totalPages: number,
  }>{
    let param = new HttpParams();
    param = param.set('page', page)
    return this.httpClient.get<Page<Review>>(environment.apiHost+'/api/reviews/events/'+eventId, {params:param}).pipe(
      map((page)=>({
        reviews:page.content,
        totalReviews:page.totalElements,
        totalPages:page.totalPages
      }))
    )
  }

  getReviewsByOffering(offeringId: number, page:number):Observable<{
    reviews:Review[],
    totalReviews: number,
    totalPages: number,
  }>{
    let param = new HttpParams();
    param = param.set('page', page)
    return this.httpClient.get<Page<Review>>(environment.apiHost+'/api/reviews/offerings/'+offeringId, {params:param}).pipe(
      map((page)=>({
        reviews:page.content,
        totalReviews:page.totalElements,
        totalPages:page.totalPages
      }))
    )
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
  getAllReviews(
    page: number,
    reviewStatus: ReviewStatus
  ): Observable<Page<Review>> {
    let params = new HttpParams();
    params = params.set('page', page);
    params = params.set('status', reviewStatus);

    return this.httpClient
      .get<Page<Review>>(environment.apiHost + '/api/reviews', {
        params,
      })
      .pipe(catchError(this.handleError));
  }
  updateReview(reviewId: number, status: ReviewStatus) {
    const reviewRequest = {
      reviewStatus: status,
    };

    return this.httpClient
      .put<Review>(
        environment.apiHost + '/api/reviews/' + reviewId,
        reviewRequest
      )
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorResponse: ErrorResponse | null = null;

    if (error.error && typeof error.error === 'object') {
      errorResponse = error.error as ErrorResponse;
    }

    return throwError(
      () =>
        ({
          code: error.status,
          message: errorResponse?.message ?? error.message,
          errors: errorResponse?.errors,
        } as ErrorResponse)

    );
  }
}
