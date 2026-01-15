import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('auth_token');

    // 1. Log para depuración (puedes quitarlo luego)
    if (!token) {
      console.warn('Interceptor: No se encontró auth_token en localStorage');
    }

    // 2. Clonamos la petición para añadir el encabezado si existe el token
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // 3. Manejo inteligente de errores
        if (error.status === 401) {
          // 401 es "No autorizado" (Token expirado o inválido) -> Ir al login
          console.error('Sesión expirada o inválida');
          localStorage.removeItem('auth_token');
          this.router.navigate(['/login']);
        } 
        
        if (error.status === 403) {
          // 403 es "Prohibido" (El token es válido pero no tienes permiso para esta acción)
          // No borramos el token, solo avisamos
          console.error('No tienes permisos suficientes para realizar esta acción (403)');
        }

        return throwError(() => error);
      })
    );
  }
}