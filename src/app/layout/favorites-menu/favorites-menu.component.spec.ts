import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesMenuComponent } from './favorites-menu.component';

describe('FavoritesMenuComponent', () => {
  let component: FavoritesMenuComponent;
  let fixture: ComponentFixture<FavoritesMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavoritesMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
