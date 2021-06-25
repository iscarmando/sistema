import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //Variable que se encarga del redireccionamiento
  routerRedirect = '';

  constructor(private usuariosService: UsuariosService,
              private router: Router) { }

  ngOnInit(): void {
  }
  onLogin(form:any):void {
    //console.log('Login', form.value);
    this.usuariosService.login(form.value)
                        .subscribe(res =>{
                          //el usuario y la contraseña son correctas
                          if (res.success){
                              //El usuario y la contraseña son correctos
                              //redireccion a empleados
                              //this.router.navigateByUrl('/');
                              this.routerRedirect = this.usuariosService.urlUsuarioIntentaAcceder;
                              this.usuariosService.urlUsuarioIntentaAcceder = '';
                              this.router.navigate([this.routerRedirect]);
                           } else {
                            if(res.message =='Password no coincide'){
                              //alert(''contraseña Incorrecta);
                               Swal.fire({
                                 icon: 'error',
                                 title: 'Error',
                                 text: 'Contraseña incorrecta',
                                 confirmButtonColor: '#A1260C'
                               })
                              }
                              if (res.message =='Usuario no encontrado'){
                                Swal.fire({
                                  icon: 'error', 
                                  title: 'Error',
                                  text: 'Usuario no encontrado',
                                  confirmButtonColor: '#A1260C'
                                })
                              }  
                          }//Else
                        })//Suscribe    
  }//Fin de onLogin

}//Fin de la clase LoginComponent