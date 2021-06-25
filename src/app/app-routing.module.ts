import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Regla que indica qie cuando el usuario teclee una ruta no valida
//el sistema se redirija a visualizar el componenetes empleados
const routes: Routes = [
  {
    path: '**', redirectTo: '/empleados', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
