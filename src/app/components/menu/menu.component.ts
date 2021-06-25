import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/usuarios/services/usuarios.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  usuarioLogueado = false;
  userName:String='';

  constructor(public usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.usuarioLogueado = this.usuariosService.isLogged('');
    //Traemos el estatus deñ usuario de memoria global para saber
    //si tiene sesion abierta
    this.usuariosService.changeLoginStatus$
      .subscribe((loggedStatus: boolean) => {
        this.usuarioLogueado = loggedStatus;
      })
      this.usuariosService.changeUserName$.subscribe((userName: String) => {
        this.userName = userName;
      })
  }//fin fe ngOnInit
  logout() {
    this.usuariosService.logout();
  }

}
