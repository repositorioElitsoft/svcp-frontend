import { HttpInterceptorFn } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Create new headers with Content-Type set to 'application/json'

  const authService = inject(AuthService); // Inject the AuthService

  const unparsedToken = authService.getToken()
  if (!unparsedToken) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const clonedRequest = req.clone({ headers });
    return next(clonedRequest);
  }

  const token: any = JSON.parse(unparsedToken); // Call getToken() method
  const tokenParaEnviar = `Bearer ${String(token.jwt)}`
  console.log("toke na enviar", tokenParaEnviar)
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': tokenParaEnviar
  });

  // Clone the request and add the new headers
  const clonedRequest = req.clone({ headers });


  // Pass the cloned request to the next handler
  return next(clonedRequest);
};
