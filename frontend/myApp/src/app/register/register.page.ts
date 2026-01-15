import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  // Objeto para el formulario
  user = {
    username: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.authService.register(this.user.username, this.user.email, this.user.password).subscribe({
      next: (res) => {
        console.log('Usuario registrado:', res);
        // Redirigir al login tras éxito
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        alert('Error al registrar: ' + err.error.message);
      }
    });
  }
}