import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  AUTH_API = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.AUTH_API}/login`, { email, password }).pipe(
      tap((res: any) => {
        console.log('Respuesta cruda del servidor:', res); // <--- ESTO ES CLAVE
        
        // Buscamos el token en cualquier variante de nombre común
        const token = res.token || res.accessToken || res.idToken || res.jwt;
        
        if (token) {
          localStorage.setItem('auth_token', token);
          console.log('Token guardado exitosamente como auth_token');
        } else {
          console.error('¡CUIDADO! El servidor no envió ninguna propiedad que parezca un token');
        }
      })
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.AUTH_API}/register`, { username, email, password });
  }
}