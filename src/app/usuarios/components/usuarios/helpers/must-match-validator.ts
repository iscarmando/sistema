import { FormGroup } from "@angular/forms";

//Validador para hacer que coicidan los dps campos con el password para
export function mustMatch(controlName: string, matchingControlName: string){
    return (formGroup:FormGroup)=>{
        //Asignanmos a dos variables los elementos del formulario para validar 
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if(matchingControl.errors && !matchingControl.errors.mustMatch){
            //Ejecutamos el return si otro validador ha econtrado errores
            //en el control de errores matchingControl
            return;
        }

        //Establecemos si el control de erroes matchingControl
        //en verdadero si la validacion falla, es decir si los control
        //password no coiciden
        if (control.value !== matchingControl.value)
            matchingControl.setErrors({mustMatch: true});
            else //los pasword son iguales y no hay errores
                matchingControl.setErrors(null);
    }//return
}//fin del fution mustMatch