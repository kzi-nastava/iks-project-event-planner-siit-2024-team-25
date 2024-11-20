import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEventFilterComponent } from './home-event-filter.component';

describe('HomeEventFilterComponent', () => {
  let component: HomeEventFilterComponent;
  let fixture: ComponentFixture<HomeEventFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeEventFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeEventFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
