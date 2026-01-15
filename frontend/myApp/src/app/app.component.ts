import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  // Las variables deben ir AQUÍ, dentro de la clase
  public appPages = [
    { title: 'Gestión de Residentes', url: '/my-recidence', icon: 'people' },
    { title: 'Asistentes Médicos', url: '/assistant-management', icon: 'medkit' },
    { title: 'Cerrar Sesión', url: '/login', icon: 'log-out' }
  ];

  constructor() {}
}