import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceListEditDialogComponent } from './price-list-edit-dialog.component';

describe('PriceListEditDialogComponent', () => {
  let component: PriceListEditDialogComponent;
  let fixture: ComponentFixture<PriceListEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PriceListEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceListEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
