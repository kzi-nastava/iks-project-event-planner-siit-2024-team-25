import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { ErrorResponse } from '../../../shared/model/error.response.model';
import { Page } from '../../../shared/model/page.mode';
import { ReviewStatus } from '../model/review-status.model';
import { Review } from '../model/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private httpClient: HttpClient) {}

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
