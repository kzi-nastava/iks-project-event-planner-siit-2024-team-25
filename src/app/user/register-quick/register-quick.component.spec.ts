import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterQuickComponent } from './register-quick.component';

describe('RegisterQuickComponent', () => {
  let component: RegisterQuickComponent;
  let fixture: ComponentFixture<RegisterQuickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterQuickComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterQuickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
