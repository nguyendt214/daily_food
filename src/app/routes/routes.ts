import { HomeComponent } from './home/home/home.component';
import { Routes } from '@angular/router';
import { AuthGuard } from './home/auth.guard';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },

  // Not found
  { path: '**', redirectTo: 'home' }

];
