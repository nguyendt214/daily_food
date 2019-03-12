import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './routes';
import { HomeModule } from './home/home.module';
import { ReportModule } from './report/report.module';
import { MissionModule } from './mission/mission.module';

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HomeModule,
    ReportModule,
    MissionModule
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})

export class RoutesModule { }
