import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOfferingFilterComponent } from './purchase-offering-filter.component';

describe('PurchaseOfferingFilterComponent', () => {
  let component: PurchaseOfferingFilterComponent;
  let fixture: ComponentFixture<PurchaseOfferingFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseOfferingFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOfferingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
