import { HomeComponent } from './home/home/home.component';
import { Routes } from '@angular/router';
import { UserResolver } from './home/user.resolver';
import { OktaAuthGuard } from '@okta/okta-angular';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
    canActivate: [OktaAuthGuard],
    resolve: { user: UserResolver }
  },

  // Not found
  { path: '**', redirectTo: 'home' }

];
