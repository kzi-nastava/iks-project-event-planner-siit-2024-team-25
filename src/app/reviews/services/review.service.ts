import { Injectable } from '@angular/core';
import { Review } from '../models/review.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Page } from '../../shared/model/page.mode';
import { ReviewStatus } from '../models/review-status.model';
import { ErrorResponse } from '../../shared/model/error.response.model';

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
