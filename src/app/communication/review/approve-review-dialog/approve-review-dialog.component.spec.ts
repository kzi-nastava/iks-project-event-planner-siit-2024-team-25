import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveReviewDialogComponent } from './approve-review-dialog.component';

describe('ApproveReviewDialogComponent', () => {
  let component: ApproveReviewDialogComponent;
  let fixture: ComponentFixture<ApproveReviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApproveReviewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveReviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
