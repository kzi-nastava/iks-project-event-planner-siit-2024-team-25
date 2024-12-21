import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferingPurchaseCardComponent } from './offering-purchase-card.component';

describe('OfferingPurchaseCardComponent', () => {
  let component: OfferingPurchaseCardComponent;
  let fixture: ComponentFixture<OfferingPurchaseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfferingPurchaseCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferingPurchaseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
