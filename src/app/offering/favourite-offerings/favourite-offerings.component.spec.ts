import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteOfferingsComponent } from './favourite-offerings.component';

describe('FavouriteOfferingsComponent', () => {
  let component: FavouriteOfferingsComponent;
  let fixture: ComponentFixture<FavouriteOfferingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavouriteOfferingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavouriteOfferingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
