import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthModule } from '../infrastructure/auth/auth.module';
import { MaterialModule } from '../infrastructure/material/material.module';
import { FavoritesMenuComponent } from './favorites-menu/favorites-menu.component';
import { NavComponent } from './nav/nav.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [NavComponent, FavoritesMenuComponent, NotFoundComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    AuthModule,
    RouterLinkActive,
  ],
  exports: [NavComponent, NotFoundComponent],
})
export class LayoutModule {}
