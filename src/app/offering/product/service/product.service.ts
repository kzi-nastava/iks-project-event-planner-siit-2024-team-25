import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { ErrorResponse } from '../../../shared/model/error.response.model';
import { Page } from '../../../shared/model/page.mode';
import { ProductFilterProperties } from '../model/product-filter-properties.model';
import { Product } from '../model/product.model';
import { ProductRequest } from '../model/product.request.model';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getProductById(productId: number): Observable<Product> {
    return this.httpClient
      .get<Product>(environment.apiHost + '/api/products/' + productId)
      .pipe(map(this.mapImages), catchError(this.handleError));
  }

  getAll(properties?: ProductFilterProperties): Observable<Product[]> {
    let params = new HttpParams();
    if (properties) {
      if (!!properties.name) {
        params = params.set('name', properties.name);
      }
      if (!!properties.minPrice) {
        params = params.set('minPrice', properties.minPrice);
      }
      if (!!properties.maxPrice) {
        params = params.set('maxPrice', properties.maxPrice);
      }
      if (properties.available) {
        params = params.set('available', properties.available);
      }
      if (!!properties.eventTypeId) {
        params = params.set('eventTypeId', properties.eventTypeId);
      }
      if (!!properties.categoryId) {
        params = params.set('categoryId', properties.categoryId);
      }
    }
    return this.httpClient
      .get<Page<Product>>(environment.apiHost + '/api/products/all', {
        params: params,
      })
      .pipe(
        map((page) => page.content),
        catchError(this.handleError)
      );
  }

  getOwnerProducts(
    properties?: ProductFilterProperties
  ): Observable<Product[]> {
    const ownerId = this.authService.getUser()?.userId;

    let params = new HttpParams();
    if (properties) {
      if (!!properties.name) {
        params = params.set('name', properties.name);
      }
      if (!!properties.minPrice) {
        params = params.set('minPrice', properties.minPrice);
      }
      if (!!properties.maxPrice) {
        params = params.set('maxPrice', properties.maxPrice);
      }
      if (properties.available) {
        params = params.set('available', properties.available);
      }
      if (!!properties.eventTypeId) {
        params = params.set('eventTypeId', properties.eventTypeId);
      }
      if (!!properties.categoryId) {
        params = params.set('categoryId', properties.categoryId);
      }
    }
    return this.httpClient
      .get<Page<Product>>(
        environment.apiHost + `/api/products/owner/${ownerId}`,
        {
          params: params,
        }
      )
      .pipe(
        map((page) => page.content),
        catchError(this.handleError)
      );
  }

  createProduct(productRequest: ProductRequest): Observable<Product> {
    return this.httpClient
      .post<Product>(
        environment.apiHost + '/api/products',
        this.buildFormData(productRequest)
      )
      .pipe(map(this.mapImages), catchError(this.handleError));
  }

  updateProduct(
    productId: number,
    productRequest: ProductRequest
  ): Observable<Product> {
    return this.httpClient
      .put<Product>(
        environment.apiHost + `/api/products/${productId}`,
        this.buildFormData(productRequest)
      )
      .pipe(map(this.mapImages), catchError(this.handleError));
  }

  deleteProduct(productId: number): Observable<any> {
    return this.httpClient.delete(
      environment.apiHost + `/api/products/${productId}`
    );
  }

  private buildFormData(productRequest: ProductRequest): FormData {
    let formData = new FormData();
    formData.append('name', productRequest.name);
    formData.append('description', productRequest.description);
    formData.append('price', productRequest.price.toString());
    formData.append('discount', productRequest.discount.toString());
    formData.append('visible', productRequest.visible.toString());
    formData.append('available', productRequest.available.toString());
    if (!!productRequest.offeringCategoryId) {
      formData.append(
        'offeringCategoryId',
        productRequest.offeringCategoryId.toString()
      );
    } else if (!!productRequest.offeringCategoryName) {
      formData.append(
        'offeringCategoryName',
        productRequest.offeringCategoryName
      );
    }
    formData.append('ownerId', productRequest.ownerId.toString());
    for (const eventTypeId of productRequest.eventTypeIds) {
      formData.append('eventTypeIds', eventTypeId.toString());
    }
    for (const image of productRequest.images) {
      formData.append('images', image, image.name);
    }
    if (!!productRequest.imagesToDelete) {
      for (const imageUrl of productRequest.imagesToDelete) {
        formData.append('imagesToDelete', this.extractImageIdFromUrl(imageUrl));
      }
    }
    return formData;
  }

  private extractImageIdFromUrl(imageUrl: string): string {
    const parts = imageUrl.split('/');
    return parts[parts.length - 1];
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

  private mapImages(product: Product): Product {
    product.images = product.images.map(
      (image) =>
        environment.apiHost + `/api/products/${product.id}/images/${image}`
    );
    return product;
  }
}
