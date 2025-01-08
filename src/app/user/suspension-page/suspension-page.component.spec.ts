import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspensionPageComponent } from './suspension-page.component';

describe('SuspensionPageComponent', () => {
  let component: SuspensionPageComponent;
  let fixture: ComponentFixture<SuspensionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuspensionPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuspensionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
