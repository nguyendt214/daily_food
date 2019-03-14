import { HomeComponent } from './home/home/home.component';
import { Routes } from '@angular/router';
import { UserResolver } from './home/user.resolver';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: { user: UserResolver }
  },
  // Not found
  { path: '**', redirectTo: 'home' }

];
