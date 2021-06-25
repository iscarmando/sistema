import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Router } from '@angular/router';
import { UsuariosI } from '../../models/usuarios';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

//importar los validadores personalidados para validar el password
//y confirmar que los password conincide
import { mustMatch } from './helpers/must-match-validator';

//Libreria para las alaertas
import Swal from 'sweetalert2';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  closeResult = '';

  //variable para el formularo
  public registerForm!: FormGroup;
  public updateForm!: FormGroup;
  public submitted = false;

  //Variable que contendra los datos del usuario a eliminar
  public user: any;
  //arreglo que contendra todos los usuarios de la db

  public users: any[];

  constructor(private usuariosService: UsuariosService,
    private router: Router,
    public modal: NgbModal,  //modal para agregar usuario
    public modalDelete: NgbModal, //modal para eliminarun usuario
    public modalUpdate: NgbModal, //modal para actualizar
              private formBuilder: FormBuilder) {
    this.users = new Array();
  }

  ngOnInit(): void {
    //agregamos al incialicar el componente el validador para el nombre
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordconfirm: ['', Validators.required],
      tipo: ['', Validators.required]
     },
      {
        validator: mustMatch('password', 'passwordconfirm')
      }
      );

  
      //Validadores para actualizar usuario
  this.updateForm = this.formBuilder.group({
    _id:[''],
    uname: ['', Validators.required],
    uemail: ['', [Validators.required, Validators.email]],
    upassword: ['', [Validators.required, Validators.minLength(6)]],
    utipo: ['', Validators.required]
  },
  );

  this.getUsers();
  }//Fin de  ngOnInit

  //metodo getter para facil acceso a los campos del formulario
  get fields() {
    return this.registerForm?.controls;
  }

  onSubmit() {
    this.submitted = true;
    //detener la ejecusion si laformulano es valida
    if (this.registerForm?.invalid) {
      return;
    }
    //console.log(this.registerForm.value)
    let usuario = {
      _id: 0,
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      tipo: this.registerForm.value.tipo
    }
    this.usuariosService.addUser(usuario)
      .subscribe(res => {
        console.log(res);
        this.getUsers();//obtenermos los usuarios
        this.registerForm.reset();//limpiamos el formulario
        this.modal.dismissAll();//cerramos el modal
      },
        err => console.log("HTTP Response", err)
      )
  }//findel onsubmit

  getUsers() {
    this.usuariosService.getUsers()
      .subscribe(res => {
        this.users = res as UsuariosService[];
        //console.log(this.users);
      })
  }//fin de gat users

  showUser(_id: string) {
    this.router.navigate(['usuarios/' + _id]);
  }//fin de showUser

  open(content: any) {
    this.registerForm.reset();
    this.modal.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }//fin de getDismissReason

  //Metodo para abri el modal para eliminar usuarios|
  abrirModalEliminar(id: string, modalName: any) {
    this.usuariosService.getUser(id)
      .subscribe(res => {
        this.user = res as UsuariosI;
      },
        err => console.log("Erro al obtener el usuario", err)
      );
    this.modalDelete.open(modalName, { size: 'sm' })
      .result.then((res) => {
        this.closeResult = `Closed with: ${res}`;
      }, (reason) => {
        this.closeResult = `Dismssed ${this.getDismissReason(reason)}`;
      });
  }//Fin del abrirModalEliminar

  //Metodo para eliminar el usuario definitivamente
  deleteUser(id: string) {
    //console.log(id);
    this.usuariosService.removeUser(id)
      .subscribe(res => {
        Swal.fire({
          icon: 'error',
          text: 'usuario Eliminado correctamente',
          confirmButtonColor: '#A126C'
        });
        this.getUsers();
        this.modalUpdate.dismissAll();
      },
        err => console.log("Error al eliminar el usuario", err)
      );
  }//Fin del deleteUser
  //Nota: Cada que se modifica un usuario se debera cambiar la contraseña
  //ya que la encriptacion no permite sobreescripcion de la contraseña
  //CArga el usuarioa modificar en el modal con sus datos de la base de datoa 
updateUser(user:UsuariosI, modalName:any){
  //console.log(user);
  //Validadores para actualizar usuario
  this.updateForm = this.formBuilder.group({
    _id:[user._id],
    uname: [user.name, Validators.required],
    uemail: [user.email],
    upassword: ['', [Validators.required, Validators.minLength(6)]],
    utipo: [user.tipo, Validators.required]
  },
  );
  this.modalUpdate.open(modalName)
      .result.then((res) => {
        this.closeResult = `Closed with: ${res}`;
      }, (reason) => {
        this.closeResult = `Dismssed ${this.getDismissReason(reason)}`;
      });
}//Fin del updateUser

updateSubmit(){
  if(this.updateForm.invalid)
  return;
  //console.log(this.updateForm.value);

  //Creamos el objeto del usuario para validar
  let userUpdate = {
    _id: this.updateForm.value._id,
    name: this.updateForm.value.uname,
    email: this.updateForm.value.uemail,
    password: this.updateForm.value.upassword,
    tipo: this.updateForm.value.utipo
  }

  this.usuariosService.updateUser(userUpdate)
                      .subscribe( res =>{
                        //console.log(res);
                        Swal.fire({
                          icon: 'success',
                          text: 'usuario Actualizado correctamente',
                          confirmButtonColor: '#30A10C'
                        });
                        this.getUsers();
                        this.modalUpdate.dismissAll();
                      }, 
                      err => console.log(err));
}//Fin del updateSubmit

//cancelUpdate
cancelUpdate(){
  this.modalUpdate.dismissAll();
}//Fin del cancelUpdate
}