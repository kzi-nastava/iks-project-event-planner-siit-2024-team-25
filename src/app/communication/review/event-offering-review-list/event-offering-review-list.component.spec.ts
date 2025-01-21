import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOfferingReviewListComponent } from './event-offering-review-list.component';

describe('EventOfferingReviewListComponent', () => {
  let component: EventOfferingReviewListComponent;
  let fixture: ComponentFixture<EventOfferingReviewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventOfferingReviewListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventOfferingReviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
