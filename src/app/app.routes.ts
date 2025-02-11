import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { HomeComponent } from './views/home/home.component';
import { TestComponent } from './views/test/test.component';

export const routes: Routes = [
    {
        path: "test",
        component: TestComponent
    },
    {
        path: "",
        redirectTo: "portal",
        pathMatch: "full"
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "portal",
        canActivate: [authGuard],
        children: [
            {
                path: "",
                redirectTo: "home",
                pathMatch: "prefix"
            },
            {
                path: "home",
                component: HomeComponent
            }
        ]
    }
];