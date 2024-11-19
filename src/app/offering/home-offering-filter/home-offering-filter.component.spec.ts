import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOfferingFilterComponent } from './home-offering-filter.component';

describe('HomeOfferingFilterComponent', () => {
  let component: HomeOfferingFilterComponent;
  let fixture: ComponentFixture<HomeOfferingFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeOfferingFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeOfferingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
