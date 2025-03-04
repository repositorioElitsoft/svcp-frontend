import { HttpInterceptorFn } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

export const mediaTypeInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  // Create new headers with Content-Type set to 'application/json'
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  // Clone the request and add the new headers
  const clonedRequest = req.clone({ headers });

  // Pass the cloned request to the next handler
  return next(clonedRequest);
};
