import { Routes, RouterModule } from '@angular/router';
import { OktaAuthGuard } from '@okta/okta-angular';
import { MissionComponent } from './crud/mission.component';
import { UserResolver } from '../home/user.resolver';
import { NgModule } from '@angular/core';
import { MissionGuard } from './crud/service/mission.guard';

export const routes: Routes = [
  {
    path: 'mission/:action',
    component: MissionComponent,
    canActivate: [OktaAuthGuard],
    resolve: { user: UserResolver }
  },
  {
    path: 'mission/:action/:id',
    component: MissionComponent,
    canActivate: [OktaAuthGuard, MissionGuard],
    resolve: { user: UserResolver }
  }

];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: Boolean(history.pushState) === false })],
  exports: [RouterModule]
})
export class MissionRoutingModule { }
