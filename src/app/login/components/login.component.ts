import { Component, OnInit, ɵsetCurrentInjector } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';
import { SignIn } from 'src/app/core/store/auth.actions';


export interface User {
  name: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  showNavigationArrows = false;
  showNavigationIndicators = false;
  images = [
    `./assets/images/login/fondo1.jpg`,
    `./assets/images/login/fondo2.jpg`
  ];

  loginForm!: FormGroup;
  validCredentials = 0; //-1 es credenciales fallidas, 0 es estado inicial, 1 es login exitoso
  isLoggingIn = false;
  errMsg = '';
  backgroundImage = '';

  constructor(
    private store: Store,
    private router: Router,
    config: NgbCarouselConfig, 
    private fb: FormBuilder) {
    // customize default values of carousels used by this component tree
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;

    config.interval = 5000;
    config.wrap = true;
  }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      name: ['', Validators.required  ],
      password: ['', Validators.required ]
    });
    //Muestra un background distinto dependiendo de la hora del día
    //fondo1 es tarde. fondo2 es mañana
    this.backgroundImage = this.images[(new Date().getHours() < 17)? 1:0];

  }

  resetLoginAlert(): void {
    this.validCredentials = 0;
  }

  save(): void{
    if (this.loginForm.valid) {
      const params = this.loginForm.value;
      // params['registrador_id'] = params['registrador']['id'];
      this.isLoggingIn = true;
      console.log(params);
      this.store.dispatch(new SignIn( params.name, params.password)).subscribe((data) => {
        // Animación de carga de Iniciando sesión...
        this.validCredentials = 1;
        console.log('Inicio de sesión exitoso');
        console.log(data);
        this.router.navigate(['/panel'], {
          state: {
            //flag para mostrar toast de bienvenida
            recentLogIn: true,
          }
        });
      },
      error => {
        // if(error.status == 400){
        switch(error.error.error){
          case 'invalid_grant': this.errMsg = 'Nombre de Usuario o Contraseña inválidos'; break;
          case 'inactive_user': this.errMsg = 'Tu cuenta aún no ha sido activada'; break;
          case 'user_not_found': this.errMsg = 'El usuario no existe'; break;
          default: this.errMsg = 'Hubo un error. Inténtalo nuevamente'; break;
        }
        this.isLoggingIn = false;
        console.log(error.error.error);
        this.validCredentials = -1;
      });

      // let categoria = <Categoria>params;
      // this.confirmSave(categoria);
    }else{

    }
  }
}
