import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAllEventsComponent } from './home-all-events.component';

describe('HomeAllEventsComponent', () => {
  let component: HomeAllEventsComponent;
  let fixture: ComponentFixture<HomeAllEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeAllEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeAllEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
