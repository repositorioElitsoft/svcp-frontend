import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/home/home.component';
import { ClasificacionClienteComponent } from './features/mantenedores/clasificacion-cliente/clasificacion-cliente.component';
import { SectorComponent } from './features/mantenedores/sector/sector.component';
import { TrabajoComponent } from './features/mantenedores/trabajo/trabajo.component';
import { TipoEmpleadoComponent } from './features/mantenedores/tipo-empleado/tipo-empleado.component';
import { ZonaComponent } from './features/mantenedores/zona/zona.component';
import { TipoClienteComponent } from './features/mantenedores/tipo-cliente/tipo-cliente.component';
import { TipoProductoComponent } from './features/mantenedores/tipo-producto/tipo-producto.component';
import { TipoServicioComponent } from './features/mantenedores/tipo-servicio/tipo-servicio.component';
import { SegmentacionClienteComponent } from './features/mantenedores/segmentacion-cliente/segmentacion-cliente.component';
import { AgrupacionComercialComponent } from './features/mantenedores/agrupacion-comercial/agrupacion-comercial.component';
import { ClienteComponent } from './features/mantenedores/cliente/cliente.component';
import { EmpleadoComponent } from './features/mantenedores/empleado/empleado.component';
import { TareaComponent } from './features/mantenedores/tarea/tarea.component';
import { DireccionComponent } from './features/mantenedores/direccion/direccion.component';
import { TiposDireccionesComponent } from './features/mantenedores/tipos-direcciones/tipos-direcciones.component';
import { DireccionEmpleadoComponent } from './features/views/direccion-empleado/direccion-empleado.component';
import { LocacionClienteComponent } from './features/views/locacion-cliente/locacion-cliente.component';
import { ContratoComponent } from './features/contrato/contrato.component';
import { RutaComponent } from './features/mantenedores/ruta/ruta.component';
import { RoleComponent } from './features/mantenedores/role/role.component';
import { TipoComponenteComponent } from './features/mantenedores/tipo-componente/tipo-componente.component';

export const routes: Routes = [
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

                path: "gestion-de-contratos",
                children: [
                    {
                        path: "contrato/:id", // Ruta independiente
                        component: ContratoComponent
                    }
                ]
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
                        path: "tareas",
                        component: TareaComponent
                    },
                    {
                        path: "sectores",
                        component: SectorComponent
                    },
                    {
                        path: "roles",
                        component: RoleComponent
                    },
                    {
                        path: "zonas",
                        component: ZonaComponent
                    }, {
                        path: "rutas",
                        component: RutaComponent
                    },
                    {
                        path: "tipos-productos",
                        component: TipoProductoComponent
                    }
                    ,
                    {
                        path: "segmentaciones-clientes",
                        component: SegmentacionClienteComponent
                    }
                    ,
                    {
                        path: "agrupaciones-comerciales",
                        component: AgrupacionComercialComponent
                    },
                    {
                        path: "clientes",
                        component: ClienteComponent
                    },
                    {
                        path: "empleados",
                        component: EmpleadoComponent
                    },

                    {
                        path: "direccion-empleado/:id", // Ruta independiente
                        component: DireccionEmpleadoComponent
                    },
                    {
                        path: "locacion-cliente/:id", // Ruta independiente
                        component: LocacionClienteComponent
                    },
                    {
                        path: "locaciones",
                        component: DireccionComponent
                    },
                    {
                        path: "tipos-direcciones",
                        component: TiposDireccionesComponent
                    },
                    {
                        path: "tipos-componentes",
                        component: TipoComponenteComponent
                    },

                    /*ruta_nueva*/
                ]
            }
        ]
    }
];