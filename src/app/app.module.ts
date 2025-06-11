import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventModule } from './event/event.module';
import { HomeComponent } from './home/home.component';
import { jwtInterceptor } from './infrastructure/auth/interceptor/jwt.interceptor';
import { MaterialModule } from './infrastructure/material/material.module';
import { LayoutModule } from './layout/layout.module';
import { OfferingModule } from './offering/offering.module';
import { CommunicationModule } from './communication/communication.module';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    MaterialModule,
    EventModule,
    OfferingModule,
    CommunicationModule,
    OfferingModule
  ],

  providers: [
    provideAnimationsAsync(),
    provideToastr(),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideCharts(withDefaultRegisterables()),
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
