import { AdminModule } from './admin/admin.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './routes';
import { HomeModule } from './home/home.module';

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HomeModule,
    AdminModule
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})

export class RoutesModule { }
