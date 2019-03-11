import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './routes';
import { HomeModule } from './home/home.module';
import { MissionModule } from './mission/mission.module';

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HomeModule,
    MissionModule
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})

export class RoutesModule { }
