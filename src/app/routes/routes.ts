import { HomeComponent } from './home/home/home.component';
import { Routes } from '@angular/router';
import { AuthGuard } from './home/auth.guard';
import { UserResolver } from './home/user.resolver';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver }
  },

  // Not found
  { path: '**', redirectTo: 'home' }

];
