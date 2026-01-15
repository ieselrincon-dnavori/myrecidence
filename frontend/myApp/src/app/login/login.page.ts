import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  credentials = {
    email: '',
    password: ''
  };

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController,
    private http: HttpClient 
  ) { }

  ngOnInit() {}

  // FUNCIÓN PARA EL BOTÓN DE ACCESO TEMPORAL
  generateToken() {
    this.http.get<any>('http://localhost:8080/api/auth/temp-token').subscribe({
      next: async (res: any) => {
        // Unificamos: siempre guardar como 'auth_token'
        const token = res.accessToken || res.token;
        if (token) {
          localStorage.setItem('auth_token', token);
          await this.presentToast('¡Acceso temporal concedido!', 'success');
          this.navCtrl.navigateRoot('/my-recidence');
        }
      },
      error: async (err: any) => {
        console.error('Error al generar token:', err);
        await this.presentToast('No se pudo generar el acceso temporal', 'danger');
      }
    });
  }

  async onLogin() {
    this.authService.login(this.credentials.email, this.credentials.password).subscribe({
      next: async (res: any) => {
        console.log('Login exitoso, preparando navegación...');
        // El AuthService ya guardó el 'auth_token' gracias al pipe(tap)
        // Guardamos el resto de datos del usuario si son necesarios
        localStorage.setItem('userData', JSON.stringify(res));
        setTimeout(() => {
    this.navCtrl.navigateRoot('/my-recidence');
  }, 100);
        // Quitamos el foco del teclado
        if (document.activeElement instanceof HTMLElement) {
          (document.activeElement as HTMLElement).blur();
        }
        
        // Navegamos
        this.navCtrl.navigateRoot('/my-recidence');
      },
      error: async (err: any) => {
        console.error('Error en login:', err);
        const mensaje = err.error?.message || 'Email o contraseña incorrectos';
        await this.presentToast(mensaje, 'danger');
      }
    });
  }

  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }

  // He mejorado el Toast para que acepte colores
  async presentToast(msj: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message: msj,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}