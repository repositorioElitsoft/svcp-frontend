import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/home/home.component';
import { TestComponent } from './views/test/test.component';
import { ClasificacionClienteComponent } from './features/mantenedores/clasificacion-cliente/clasificacion-cliente.component';
import { SectorComponent } from './features/mantenedores/sector/sector.component';
import { TrabajoComponent } from './features/mantenedores/trabajo/trabajo.component';
import { TipoEmpleadoComponent } from './features/mantenedores/tipo-empleado/tipo-empleado.component';
import { ZonaComponent } from './features/mantenedores/zona/zona.component';
import { TipoClienteComponent } from './features/mantenedores/tipo-cliente/tipo-cliente.component';
import { TipoServicioComponent } from './features/mantenedores/tipo-servicio/tipo-servicio.component';

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
            },
            {
                path: "mantenedores",
                children: [
                    {
                        path: "clasificacion-clientes",
                        component: ClasificacionClienteComponent
                    },
                    {
                        path: "tipos-empleados",
                        component: TipoEmpleadoComponent
                    },
                    {
                        path: "tipos-clientes",
                        component: TipoClienteComponent
                    },
                    {
                        path: "tipos-servicios",
                        component: TipoServicioComponent
                    },
                    {
                        path: "trabajos",
                        component: TrabajoComponent
                    },
                    {
                        path: "sectores",
                        component: SectorComponent
                    },
                    {
                        path: "zona",
                        component: ZonaComponent
                    }
                    /*ruta_nueva*/
                ]
            }
        ]
    }
];