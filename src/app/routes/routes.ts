import { HomeComponent } from './home/home/home.component';

export const routes = [

    {
        path: '',
        component: HomeComponent
    },

    // Not found
    { path: '**', redirectTo: 'home' }

];
