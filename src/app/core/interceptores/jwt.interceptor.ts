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

  // Determinar si es una solicitud para subir imagen
  const esSubidaImagen = req.url.includes('/imagen') && req.method === 'POST';

  if (!unparsedToken) {
    let headers = new HttpHeaders();

    // Solo agregar Content-Type para solicitudes que no son de subida de imágenes
    if (!esSubidaImagen) {
      headers = headers.set('Content-Type', 'application/json');
    }

    const clonedRequest = req.clone({ headers });
    return next(clonedRequest);
  }

  const token: any = JSON.parse(unparsedToken);
  const tokenParaEnviar = `Bearer ${String(token.jwt)}`;
  console.log("token a enviar", tokenParaEnviar);

  let headers = new HttpHeaders({
    'Authorization': tokenParaEnviar
  });

  // Solo agregar Content-Type para solicitudes que no son de subida de imágenes
  if (!esSubidaImagen) {
    headers = headers.set('Content-Type', 'application/json');
  }

  const clonedRequest = req.clone({ headers });
  return next(clonedRequest);
};
