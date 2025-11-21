// Copia y pega este código en: frontend\myApp\src\app\login\login.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

// *******************
// Importar el componente real de su propio archivo .page.ts
import { LoginPage } from './login.page'; 
// *******************

const routes: Routes = [
  {
    path: '',
    component: LoginPage // Usamos el componente importado
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  // Declaramos el componente de la página de Login
  declarations: [LoginPage] 
})
export class LoginPageModule {}