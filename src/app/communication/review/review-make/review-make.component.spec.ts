import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewMakeComponent } from './review-make.component';

describe('ReviewMakeComponent', () => {
  let component: ReviewMakeComponent;
  let fixture: ComponentFixture<ReviewMakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewMakeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewMakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
