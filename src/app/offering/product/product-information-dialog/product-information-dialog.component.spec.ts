import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDialogInformationComponent } from './product-information-dialog.component';

describe('ProductInformationDialogComponent', () => {
  let component: ProductDialogInformationComponent;
  let fixture: ComponentFixture<ProductDialogInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductDialogInformationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDialogInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
