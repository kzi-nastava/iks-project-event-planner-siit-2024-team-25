import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTopOfferingsComponent } from './home-top-offerings.component';

describe('HomeTopOfferingsComponent', () => {
  let component: HomeTopOfferingsComponent;
  let fixture: ComponentFixture<HomeTopOfferingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeTopOfferingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeTopOfferingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
