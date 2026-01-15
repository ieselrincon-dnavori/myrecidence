import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    // ************ CORRECCIÓN AQUÍ ************
    // Se importa el módulo (.module) y se busca la clase del módulo (LoginPageModule)
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'my-recidence',
    loadChildren: () => import('./my-recidence/my-recidence.module').then( m => m.MyRecidencePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'assistant-management',
    loadChildren: () => import('./pages/assistant-management/assistant-management.module').then( m => m.AssistantManagementPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }