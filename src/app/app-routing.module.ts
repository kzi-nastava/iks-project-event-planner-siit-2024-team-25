import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListServicesComponent } from './infrastructure/Offering/service/list-services/list-services.component';
import { ServiceComponent } from './infrastructure/Offering/service/service.component';

const routes: Routes = [
  { path: 'servicePage', component: ServiceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
