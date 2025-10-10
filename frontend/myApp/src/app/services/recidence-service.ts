// src/app/services/recidence-service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecidenceService {

  // Asumiendo que esta es la base de la URL para todos los endpoints
  endpoint = 'http://localhost:8080/api/users_recidence';

  constructor(private http: HttpClient) {} // Usar 'http' por convención

  // 🔹 Obtener todos los registros (READ)
  getRecidence(): Observable<any> {
    return this.http.get(this.endpoint);
  }

  // 🔹 Agregar nuevo usuario (CREATE)
  addRecidence(data: any): Observable<any> {
    return this.http.post(this.endpoint, data);
  }

  // ✅ 🔸 AÑADIDO: Actualizar registro (UPDATE - PUT)
  updateRecidence(id: number, data: any): Observable<any> {
    // La URL debe incluir el ID: http://localhost:8080/api/users_recidence/123
    return this.http.put(`${this.endpoint}/${id}`, data);
  }

  // ✅ 🔸 AÑADIDO: Eliminar registro (DELETE)
  deleteRecidence(id: number): Observable<any> {
    // La URL debe incluir el ID: http://localhost:8080/api/users_recidence/123
    return this.http.delete(`${this.endpoint}/${id}`);
  }
}