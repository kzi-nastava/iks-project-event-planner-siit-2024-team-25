import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBlockedUsersComponent } from './all-blocked-users.component';

describe('AllBlockedUsersComponent', () => {
  let component: AllBlockedUsersComponent;
  let fixture: ComponentFixture<AllBlockedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllBlockedUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllBlockedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
