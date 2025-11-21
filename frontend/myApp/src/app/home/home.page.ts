import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  // Asumo que tu componente no es standalone por el código proporcionado
  standalone: false, 
})
export class HomePage {

  constructor(private router: Router) {}

  /**
   * Navega a la página de login.
   * La página de login será responsable de redirigir a '/my-recidence'
   * si el inicio de sesión es exitoso.
   */
  gotoMyRecidence() {
    // Redirigir siempre a la página de login. 
    // Asegúrate de que tienes una ruta configurada para '/login' en tu AppRoutingModule.
    this.router.navigate(['/login']);
  }
}