import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTopEventsComponent } from './home-top-events.component';

describe('HomeTopEventsComponent', () => {
  let component: HomeTopEventsComponent;
  let fixture: ComponentFixture<HomeTopEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeTopEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeTopEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
