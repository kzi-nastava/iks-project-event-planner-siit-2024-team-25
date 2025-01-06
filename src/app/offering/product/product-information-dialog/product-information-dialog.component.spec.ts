import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInformationDialogComponent } from './product-information-dialog.component';

describe('ProductInformationDialogComponent', () => {
  let component: ProductInformationDialogComponent;
  let fixture: ComponentFixture<ProductInformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductInformationDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
