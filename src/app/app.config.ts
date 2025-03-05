import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { mediaTypeInterceptorInterceptor } from './core/interceptores/media-type-interceptor.interceptor';
import { jwtInterceptor } from './core/interceptores/jwt.interceptor';

// Función para cargar los archivos de traducción
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideToastr({
      timeOut: 10000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),
    provideHttpClient(
      withInterceptors([mediaTypeInterceptorInterceptor, jwtInterceptor]) // Agrega tu interceptor aquí
    ),
    // Configuración de @ngx-translate
    ...TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'es', // Idioma por defecto
    }).providers || [],
  ],
};