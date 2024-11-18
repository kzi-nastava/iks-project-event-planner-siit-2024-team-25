import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOfferingCardComponent } from './home-offering-card.component';

describe('HomeOfferingCardComponent', () => {
  let component: HomeOfferingCardComponent;
  let fixture: ComponentFixture<HomeOfferingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeOfferingCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeOfferingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
