import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerEventPurchaseComponent } from './organizer-event-purchase.component';

describe('OrganizerEventPurchaseComponent', () => {
  let component: OrganizerEventPurchaseComponent;
  let fixture: ComponentFixture<OrganizerEventPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizerEventPurchaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerEventPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
