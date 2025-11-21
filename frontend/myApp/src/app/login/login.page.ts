import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  user: string = '';
  password: string = '';

  // Cuatro usuarios válidos (ejemplo)
  validUsers = [
    { user: 'juan', pass: '1234' },
    { user: 'maria', pass: 'abcd' },
    { user: 'pedro', pass: 'qwerty' },
    { user: 'laura', pass: 'pass123' }
  ];

  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

  // ... (resto del código)

  async login() {
    console.log('Intentando iniciar sesión con:', this.user, this.password);

    // Buscar si el usuario y contraseña coinciden con uno de los válidos
    const found = this.validUsers.find(
      u => u.user === this.user && u.pass === this.password
    );

    if (found) {
      console.log('Login exitoso!');
      
      // 🛑 FIX: Quitar el foco del elemento activo (el botón) antes de la navegación.
      // Esto previene el error 'Blocked aria-hidden' y permite la interacción.
      if (document.activeElement instanceof HTMLElement) {
          (document.activeElement as HTMLElement).blur();
      }
      
      this.navCtrl.navigateRoot('/my-recidence');
    } else {
      console.log('Credenciales incorrectas');
      // Aquí puedes agregar un alert de Ionic, Toast, etc.
    }
  }
}