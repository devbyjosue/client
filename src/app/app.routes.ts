import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Info } from './pages/info/info';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        title: 'Home Page'
    },
    {
       path: ':section/:subSection',
       component: Info,
       title: 'Data Section'
    },
   {
       path: ':section/:subSection/table',
       component: Info,
       title: 'Data Section',
       canActivate: [AuthGuard]
    },
];
