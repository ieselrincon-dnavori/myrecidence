import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {
  private API_URL = 'http://localhost:8080/api/medical-assistants';

  constructor(private http: HttpClient) { }

  getAssistants(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  createAssistant(assistant: any): Observable<any> {
    return this.http.post(this.API_URL, assistant);
  }

  updateAssistant(id: number, assistant: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, assistant);
  }

  deleteAssistant(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}