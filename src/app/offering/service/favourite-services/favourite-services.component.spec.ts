import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteServicesComponent } from './favourite-services.component';

describe('FavouriteServicesComponent', () => {
  let component: FavouriteServicesComponent;
  let fixture: ComponentFixture<FavouriteServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavouriteServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavouriteServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
