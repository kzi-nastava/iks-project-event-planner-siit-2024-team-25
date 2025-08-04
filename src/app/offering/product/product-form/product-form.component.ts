import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { EventTypeService } from '../../../event/service/event-type.service';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { ErrorResponse } from '../../../shared/model/error.response.model';
import { OfferingCategoryService } from '../../offering-category/offering-category.service';
import { ProductRequest } from '../model/product.request.model';
import { ProductService } from '../service/product.service';

interface BasicInfoForm {
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  price: FormControl<number | null>;
  categoryId: FormControl<number | null>;
  categoryName: FormControl<string | null>;
  eventTypes: FormControl<number[] | null>;
  discount: FormControl<number | null>;
}

interface VisibilityForm {
  visible: FormControl<boolean | null>;
  available: FormControl<boolean | null>;
}

interface ProductForm {
  basicInfo: FormGroup<BasicInfoForm>;
  visibility: FormGroup<VisibilityForm>;
  images: FormArray<FormControl<any>>;
}

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  isLoading = false;
  productForm!: FormGroup<ProductForm>;
  categories: any[] = [];
  eventTypes: any[] = [];
  selectedFiles: File[] = [];
  isEditMode = false;
  pageTitle = 'Create New Product';
  productId?: number;
  imagesToDelete: string[] = [];
  existingImages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: OfferingCategoryService,
    private eventTypeService: EventTypeService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {
    this.initForm();
  }

  private initForm() {
    this.productForm = this.fb.group({
      basicInfo: this.fb.group<BasicInfoForm>({
        name: this.fb.control<string | null>(null, [
          Validators.required,
          Validators.minLength(3),
        ]),
        description: this.fb.control<string | null>(null, [
          Validators.required,
          Validators.maxLength(255),
        ]),
        price: this.fb.control<number | null>(null, [
          Validators.required,
          Validators.min(0.01),
        ]),
        categoryId: this.fb.control<number | null>(null),
        categoryName: this.fb.control<string | null>(null),
        eventTypes: this.fb.control<number[]>([]),
        discount: this.fb.control<number>(0, [
          Validators.min(0),
          Validators.max(100),
        ]),
      }),
      visibility: this.fb.group<VisibilityForm>({
        visible: this.fb.control<boolean>(true),
        available: this.fb.control<boolean>(true),
      }),
      images: this.fb.array<FormControl<any>>([]),
    });
  }

  get basicInfo(): FormGroup {
    return this.productForm.get('basicInfo') as FormGroup;
  }

  get visibility(): FormGroup {
    return this.productForm.get('visibility') as FormGroup;
  }

  ngOnInit() {
    this.loadCategories();
    this.loadEventTypes();

    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.isEditMode = true;
      this.pageTitle = 'Edit Product';
      this.productId = Number(productId);

      this.basicInfo.get('categoryId')?.disable();
      this.basicInfo.get('categoryName')?.disable();

      this.loadProduct(this.productId);
    }
    
  }

  private loadCategories() {
    this.isLoading = true;
    this.categoryService
      .getAll()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (categories) => (this.categories = categories),
        error: () => this.toastr.error('Failed to load categories'),
      });
  }

  private loadEventTypes() {
    this.eventTypeService.getAllEventTypes().subscribe({
      next: (types) => (this.eventTypes = types),
      error: () => this.toastr.error('Failed to load event types'),
    });
  }

  private loadProduct(id: number) {
    this.isLoading = true;
    this.productService
      .getProductById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (product) => {
          this.productForm.patchValue({
            basicInfo: {
              name: product.name,
              description: product.description,
              price: product.price,
              categoryId: product.offeringCategory.id,
              categoryName: product.offeringCategory.name,
              eventTypes: product.eventTypes.map((et) => et.id),
              discount: product.discount,
            },
            visibility: {
              visible: product.visible,
              available: product.available,
            },
          });
          this.existingImages = product.images;
        },
        error: () => {
          this.toastr.error('Failed to load product');
          this.router.navigate(['/products']);
        },
      });
  }

  onCategoryInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    const existingCategory = this.categories.find((c) => c.name === input);

    if (!existingCategory) {
      this.basicInfo.patchValue({
        categoryId: null,
        categoryName: input,
      });
    }
  }

  onCategoryOptionSelected(event: any): void {
    const selectedId = event.option.value;
    const selectedCategory = this.categories.find((c) => c.id === selectedId);

    if (selectedCategory) {
      this.basicInfo.patchValue({
        categoryId: selectedId,
        categoryName: selectedCategory.name,
      });
    }
  }

  removeExistingImage(imageUrl: string) {
    this.imagesToDelete.push(imageUrl);
    this.existingImages = this.existingImages.filter((img) => img !== imageUrl);
  }

  onFileSelected(files: File[]) {
    this.selectedFiles = [...this.selectedFiles, ...Array.from(files)];
  }

  onSubmit() {
    if (this.productForm.invalid || !this.canSubmit) {
      return;
    }

    const formValue = this.productForm.value;
    const productRequest: ProductRequest = {
      name: formValue.basicInfo?.name || '',
      description: formValue.basicInfo?.description || '',
      price: formValue.basicInfo?.price || 0,
      discount: formValue.basicInfo?.discount || 0,
      visible: formValue.visibility?.visible || false,
      available: formValue.visibility?.available || false,
      images: this.selectedFiles,
      eventTypeIds: formValue.basicInfo?.eventTypes || [],
      offeringCategoryId: formValue.basicInfo?.categoryId || 0,
      offeringCategoryName: formValue.basicInfo?.categoryName ?? undefined,
      ownerId: this.authService.getUser()?.userId || 0,
      imagesToDelete: !this.imagesToDelete ? undefined : this.imagesToDelete,
    };

    this.isLoading = true;
    const request =
      this.isEditMode && this.productId
        ? this.productService.updateProduct(this.productId, productRequest)
        : this.productService.createProduct(productRequest);

    request.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: (product) => {
        this.toastr.success(
          `Product successfully ${this.isEditMode ? 'updated' : 'created'}`,
        );
        this.router.navigate(['/products', product.id]);
      },
      error: (error: ErrorResponse) => {
        this.toastr.error(error.message, 'Failed to register');
        if (error.errors) {
          Object.keys(error.errors).forEach((fieldName) => {
            const control = this.productForm.get(fieldName);
            if (control) {
              control.setErrors({ serverError: error.errors[fieldName] });
            }
          });
        }
      },
    });
  }

  get canSubmit(): boolean {
    return this.productForm.valid && this.selectedFiles.length > 0;
  }
}
