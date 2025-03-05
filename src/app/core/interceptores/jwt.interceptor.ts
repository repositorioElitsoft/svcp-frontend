import { HttpInterceptorFn } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

export const mediaTypeInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  // Create new headers with Content-Type set to 'application/json'

  const authService = inject(AuthService); // Inject the AuthService
  const token = authService.getToken(); // Call getToken() method

  const headers = new HttpHeaders({
    'Authorization': String(token)
  });

  // Clone the request and add the new headers
  const clonedRequest = req.clone({ headers });


  // Pass the cloned request to the next handler
  return next(clonedRequest);
};
