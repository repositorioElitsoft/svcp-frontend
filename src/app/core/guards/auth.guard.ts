import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';


export const authGuard: CanActivateFn = (route, state) => {

    const authService = inject(AuthService);
    const router = inject(Router);


    if (authService.isAuthenticatedUser()) {
        const requiredRole = route.data['role'];

        const userRoles = authService.currentUser.authorities;

        console.log('usuario roles: ', userRoles);
        console.log('rol requerido: ', requiredRole);

        return true;
    }
    router.navigate(['/login']);
    return false;
};
