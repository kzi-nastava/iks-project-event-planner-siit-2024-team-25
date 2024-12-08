import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferingCategoryListComponent } from './offering-category-list.component';

describe('OfferingCategoryListComponent', () => {
  let component: OfferingCategoryListComponent;
  let fixture: ComponentFixture<OfferingCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfferingCategoryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferingCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
