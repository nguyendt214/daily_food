import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MissionComponent } from './crud/mission.component';
import { MissionRoutingModule } from './mission.router';
import { MuAdpModule } from '@mu/components';
import { environment } from '../../../environments/environment';
import { MissionGuard } from './crud/service/mission.guard';

@NgModule({
  imports: [
    MissionRoutingModule,
    MuAdpModule.forRoot({
      adp_url: environment.kong_url + environment.adp_api,
      production: !environment.production
    }),
    SharedModule
  ],
  declarations: [MissionComponent],
  exports: [],
  providers: [MissionGuard]
})

export class MissionModule { }
