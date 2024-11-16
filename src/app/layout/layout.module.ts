import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthModule } from '../infrastructure/auth/auth.module';
import { MaterialModule } from '../infrastructure/material/material.module';
import { NavComponent } from './nav/nav.component';

@NgModule({
  declarations: [NavComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    AuthModule,
    RouterLinkActive,
  ],
  exports: [NavComponent],
})
export class LayoutModule {}
