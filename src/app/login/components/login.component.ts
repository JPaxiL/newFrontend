import { Component, OnInit } from '@angular/core';
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

  constructor(
    private store: Store,
    private router: Router,
    config: NgbCarouselConfig, private fb: FormBuilder) {
    // customize default values of carousels used by this component tree
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;

    config.interval = 1000;
    config.wrap = true;
  }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      name: ['', Validators.required  ],
      password: ['', Validators.required ]
    });

  }

  save(): void{
    if (this.loginForm.valid) {
      const params = this.loginForm.value;
      // params['registrador_id'] = params['registrador']['id'];
      this.isLoggingIn = true;
      console.log(params);
      this.store.dispatch(new SignIn( params.name, params.password)).subscribe((data) => {
        // Animación de carga de Iniciando sesión...
        // this.validCredentials = 1;
        console.log('Inicio de sesión exitoso');
        this.router.navigate(['/panel']);
      },
      error => {
        if(error.status == 400){
          this.isLoggingIn = false;
          this.validCredentials = -1;
        }
      });

      // let categoria = <Categoria>params;
      // this.confirmSave(categoria);
    }else{

    }
  }
}
