import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAllOfferingsComponent } from './home-all-offerings.component';

describe('HomeAllOfferingsComponent', () => {
  let component: HomeAllOfferingsComponent;
  let fixture: ComponentFixture<HomeAllOfferingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeAllOfferingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeAllOfferingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
