import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from '../can-activate.guard';
import { LoginComponent } from './components/login/login.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { UsuariodetalleComponent } from './components/usuariodetalle/usuariodetalle.component';
//La ruta de usuarios estara en localhost:4200/usuarios
//La ruta hija mostrara:400
//localhost:4200/usuarios/1 <----muestra el usuario1 lo toma el id 
const routes: Routes = [
  { path: 'usuarios', 
  component: UsuariosComponent,
  canActivate: [CanActivateGuard],
  children: [
    { path: ':id', 
    component: UsuariodetalleComponent,
    canActivate: [CanActivateGuard] 
    } 
  ]

},
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
