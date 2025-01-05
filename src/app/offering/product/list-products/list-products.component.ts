import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EventTypeService } from '../../../event/service/event-type.service';
import { ErrorResponse } from '../../../shared/model/error.response.model';
import { EventType } from '../../model/event-type';
import { OfferingCategory } from '../../offering-category/model/offering-category';
import { OfferingCategoryService } from '../../offering-category/offering-category.service';
import { ProductFilterProperties } from '../model/product-filter-properties.model';
import { Product } from '../model/product.model';
import { ProductService } from '../service/product.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface FilterFormGroup {
  name: FormControl<string | null>;
  minPrice: FormControl<number | null>;
  maxPrice: FormControl<number | null>;
  available: FormControl<boolean | null>;
  eventTypeId: FormControl<number | null>;
  categoryId: FormControl<number | null>;
}

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnInit {
  filterForm: FormGroup<FilterFormGroup>;
  products: Product[] = [];
  isFilter: boolean = false;
  eventTypes = new Map<number, string>();
  offeringCategories = new Map<number, string>();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private eventTypeService: EventTypeService,
    private offeringCategoryService: OfferingCategoryService,
    private toastr: ToastrService,
  ) {
    this.filterForm = this.fb.group<FilterFormGroup>({
      name: this.fb.control(''),
      minPrice: this.fb.control(0),
      maxPrice: this.fb.control(0),
      available: this.fb.control(false),
      eventTypeId: this.fb.control(null),
      categoryId: this.fb.control(null),
    });
  }

  ngOnInit(): void {
    this.loadDropdownData();
    this.setupFilterSubscription();
    this.getProducts();
  }

  private loadDropdownData(): void {
    this.eventTypeService.getEventTypes().subscribe({
      next: (types: EventType[]) => {
        types.forEach((type) => this.eventTypes.set(type.id, type.name));
      },
      error: (err: ErrorResponse) => {
        this.toastr.error(err.message, 'Error loading event types');
      },
    });

    this.offeringCategoryService.getAll().subscribe({
      next: (categories: OfferingCategory[]) => {
        categories.forEach((cat) =>
          this.offeringCategories.set(cat.id, cat.name),
        );
      },
      error: (err: ErrorResponse) => {
        this.toastr.error(err.message, 'Error loading categories');
      },
    });
  }

  private setupFilterSubscription(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.getProducts();
      });
  }

  getProducts(): void {
    const filters: ProductFilterProperties = {
      name: this.filterForm.controls.name.value || '',
      minPrice: this.filterForm.controls.minPrice.value || 0,
      maxPrice: this.filterForm.controls.maxPrice.value || 0,
      available: this.filterForm.controls.available.value || false,
      eventTypeId: this.filterForm.controls.eventTypeId.value || undefined,
      categoryId: this.filterForm.controls.categoryId.value || undefined,
    };

    this.productService.getAll(filters).subscribe({
      next: (products: Product[]) => {
        this.products = products;
      },
      error: (err: ErrorResponse) => {
        this.toastr.error(err.message, 'Error loading products');
      },
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterForm.controls.name.setValue(input.value, { emitEvent: true });
  }

  clickFilter(): void {
    this.isFilter = !this.isFilter;
  }

  cancelFilter(): void {
    this.filterForm.reset({
      name: '',
      minPrice: 0,
      maxPrice: 0,
      available: false,
      eventTypeId: null,
      categoryId: null,
    });
  }

  onEventTypeSelected(event: any): void {
    this.filterForm.controls.eventTypeId.setValue(event.value, {
      emitEvent: true,
    });
  }

  onCategorySelected(event: any): void {
    this.filterForm.controls.categoryId.setValue(event.value, {
      emitEvent: true,
    });
  }
}
