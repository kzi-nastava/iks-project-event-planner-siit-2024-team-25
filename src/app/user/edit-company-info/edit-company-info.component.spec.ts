import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompanyInfoComponent } from './edit-company-info.component';

describe('EditCompanyInfoComponent', () => {
  let component: EditCompanyInfoComponent;
  let fixture: ComponentFixture<EditCompanyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCompanyInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCompanyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
