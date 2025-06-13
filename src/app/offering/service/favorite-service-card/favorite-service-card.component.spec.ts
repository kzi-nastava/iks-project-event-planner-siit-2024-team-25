import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteServiceCardComponent } from './favorite-service-card.component';

describe('FavoriteServiceCardComponent', () => {
  let component: FavoriteServiceCardComponent;
  let fixture: ComponentFixture<FavoriteServiceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavoriteServiceCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteServiceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
