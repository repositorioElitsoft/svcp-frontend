import { HttpInterceptorFn, HttpHeaders } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../../auth/services/auth.service";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Excluir peticiones a la API de Google Maps
  if (req.url.includes('https://maps.googleapis.com')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const unparsedToken = authService.getToken();

  if (!unparsedToken) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const clonedRequest = req.clone({ headers });
    return next(clonedRequest);
  }

  const token: any = JSON.parse(unparsedToken);
  const tokenParaEnviar = `Bearer ${String(token.jwt)}`;
  console.log("token a enviar", tokenParaEnviar);

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': tokenParaEnviar
  });

  const clonedRequest = req.clone({ headers });
  return next(clonedRequest);
};
