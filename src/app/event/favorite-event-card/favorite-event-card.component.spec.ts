import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteEventCardComponent } from './favorite-event-card.component';

describe('FavoriteEventCardComponent', () => {
  let component: FavoriteEventCardComponent;
  let fixture: ComponentFixture<FavoriteEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavoriteEventCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoriteEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
