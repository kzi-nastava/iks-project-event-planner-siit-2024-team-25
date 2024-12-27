import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductToBuyCardComponent } from './product-to-buy-card.component';

describe('ProductToBuyCardComponent', () => {
  let component: ProductToBuyCardComponent;
  let fixture: ComponentFixture<ProductToBuyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductToBuyCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductToBuyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
