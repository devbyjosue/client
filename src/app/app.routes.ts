import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Info } from './pages/info/info';
import { AuthGuard } from './auth-guard';
import { Users } from './pages/users/users';
import { Roles } from './pages/roles/roles';
import { Menus } from './pages/menus/menus';
import { MenuRoles } from './pages/menu-roles/menu-roles';
import { Sales } from './pages/sales/sales';
import { Unauthorized } from './pages/unauthorized/unauthorized';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        title: 'Home Page'
    },
    {
        path: 'Users',
        component: Users,
        title: 'Users',
        data: { roles: ["TI Dev"] },

    },
    {
        path: 'Roles',
        component: Roles,
        title: 'Roles',
        data: { roles: ["TI Dev"] },

    },
    {
        path: 'Menus',
        component: Menus,
        title: 'Data Section',
        data: { roles: ["TI Dev"] },
    },
    {
        path: 'MenuRoles',
        component: MenuRoles,
        title: 'Data Section',
        data: { roles: ["Admin","TI Dev"] },
    },
    {
        path: 'Sales',
        component: Sales,
        title: 'Data Section',
        // canActivate: [AuthGuard],
        data: { roles: ["Admin","User","TI Dev"] },
    },
    {
        path: 'Configuration',
        component: Home,
        title: 'Data Section',
    },
    {
        path: 'Testing',
        component: Home,
        title: 'Data Section',
    },
    {
        path: 'IT',
        component: Home,
        title: 'Data Section',
    },

    {
        path: 'unauthorized',
        component: Unauthorized,
        title: 'Unauthorized',
    }
];
