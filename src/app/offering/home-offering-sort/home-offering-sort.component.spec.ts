import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOfferingSortComponent } from './home-offering-sort.component';

describe('HomeOfferingSortComponent', () => {
  let component: HomeOfferingSortComponent;
  let fixture: ComponentFixture<HomeOfferingSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeOfferingSortComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeOfferingSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
