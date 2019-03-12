import { HomeComponent } from './home/home/home.component';
import { Routes } from '@angular/router';
import { UserResolver } from './home/user.resolver';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { ReportComponent } from './report/report/report.component';
import { MainReportComponent } from './report/report.main.component';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
    canActivate: [OktaAuthGuard],
    resolve: { user: UserResolver }
  },
  {
    path: 'report',
    component: MainReportComponent,
    canActivate: [OktaAuthGuard],
    resolve: { user: UserResolver }
  },
  {
    path: 'report/show-list',
    component: ReportComponent,
    canActivate: [OktaAuthGuard],
    resolve: { user: UserResolver }
  },
  {
    path: 'implicit/callback',
    component: OktaCallbackComponent
  },
  // Not found
  { path: '**', redirectTo: 'home' }

];
