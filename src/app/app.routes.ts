import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Info } from './pages/info/info';
import { AuthGuard } from './auth-guard';
import { Users } from './pages/users/users';
import { Roles } from './pages/roles/roles';
import { Menus } from './pages/menus/menus';
import { MenuRoles } from './pages/menu-roles/menu-roles';
import { Sales } from './pages/sales/sales';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        title: 'Home Page'
    },
    {
        path: 'configuration/users',
        component: Users,
        title: 'Users'
    },
    {
        path: 'configuration/roles',
        component: Roles,
        title: 'Roles'
    },
    {
        path: 'configuration/menus',
        component: Menus,
        title: 'Data Section'
    },
    {
        path: 'configuration/menu-roles',
        component: MenuRoles,
        title: 'Data Section'
    },
    {
        path: 'admin/sales',
        component: Sales,
        title: 'Data Section',
        canActivate: [AuthGuard]
    }
//     {
//        path: ':section/:subSection',
//        component: Info,
//        title: 'Data Section'
//     },
//    {
//        path: ':section/:subSection/table',
//        component: Info,
//        title: 'Data Section',
//        canActivate: [AuthGuard]
//     },
];
