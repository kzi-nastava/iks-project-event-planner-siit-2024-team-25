import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllReportedUsersComponent } from './all-reported-users.component';

describe('AllReportedUsersComponent', () => {
  let component: AllReportedUsersComponent;
  let fixture: ComponentFixture<AllReportedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllReportedUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllReportedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
