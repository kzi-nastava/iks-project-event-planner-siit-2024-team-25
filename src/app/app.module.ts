import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventModule } from './event/event.module';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './infrastructure/material/material.module';
import { LayoutModule } from './layout/layout.module';
import { OfferingModule } from './offering/offering.module';

@NgModule({
  declarations:  [AppComponent, HomeComponent],
  imports: [BrowserModule, AppRoutingModule, LayoutModule, MaterialModule,EventModule,
    OfferingModule],

  providers: [provideAnimationsAsync(), provideToastr()], 

  bootstrap: [AppComponent],
})
export class AppModule {}
