import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'service',
    loadChildren: () =>
      import('./offering/service/service.module').then((m) => m.ServiceModule),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./offering/product/product.module').then((m) => m.ProductModule),
  },
  {
    path: 'event',
    loadChildren: () =>
      import('./event/event.module').then((m) => m.EventModule),
  },
  {
    path: 'offering-category',
    loadChildren: () =>
      import('./offering/offering-category/offering-category.module').then(
        (m) => m.OfferingCategoryModule,
      ),
  },
  {
    path: 'offering',
    loadChildren: () =>
      import('./offering/offering.module').then((m) => m.OfferingModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
