import { Component, OnInit } from '@angular/core';
//para obtener los parametros de la url con el id del usuario
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosI } from '../../models/usuarios';
import { UsuariosService } from '../../services/usuarios.service';
@Component({
  selector: 'app-usuariodetalle',
  templateUrl: './usuariodetalle.component.html',
  styleUrls: ['./usuariodetalle.component.css']
})
export class UsuariodetalleComponent implements OnInit {

  id:any='';//Para obtener el id del usuario
  usuario:UsuariosI | undefined;
  constructor(private router:Router,
              private activatedRoute: ActivatedRoute,
              private UsuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    //console.log(this.id);
    this.getUser(this.id);
  }


  //Obtener los datos del usuario por id
  getUser(id: string){
    this.UsuariosService.getUser(id)
                        .subscribe(res =>{
                          this.usuario = res as UsuariosI
                          console.log(this.usuario);
                        });
  }//Fin del getUser

}
