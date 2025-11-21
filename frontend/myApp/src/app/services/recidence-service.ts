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

  constructor(private http: HttpClient) {}

  //get
  getRecidence(): Observable<any> {
    return this.http.get(this.endpoint);
  }

  //create
  addRecidence(data: any): Observable<any> {
    return this.http.post(this.endpoint, data);
  }

  //update
  updateRecidence(id: number, data: any): Observable<any> {
    return this.http.put(`${this.endpoint}/${id}`, data);
  }

  //delete
  deleteRecidence(id: number): Observable<any> {
    return this.http.delete(`${this.endpoint}/${id}`);
  }
}