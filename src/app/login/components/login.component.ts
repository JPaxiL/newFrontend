import { Component, OnInit, ɵsetCurrentInjector } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';
import { SignIn } from 'src/app/core/store/auth.actions';
import { UsersService } from 'src/app/dashboard/service/users.service';
import { EventSocketService } from 'src/app/events/services/event-socket.service';
import { EventService } from 'src/app/events/services/event.service';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';

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
    `./assets/images/login/background_cc.png`,
    `./assets/images/login/background_city.png`
  ];

  loginForm!: FormGroup;
  validCredentials = 0; //-1 es credenciales fallidas, 0 es estado inicial, 1 es login exitoso
  isLoggingIn = false;
  errMsg = '';

  constructor(
    private store: Store,
    private router: Router,
    config: NgbCarouselConfig,
    private fb: FormBuilder,
    public userService: UsersService,
    public eventService: EventService,
    private eventSocketService: EventSocketService,
    private userDataService: UserDataService,
    private vehicleService: VehicleService,
    ) {
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
  }

  resetLoginAlert(): void {
    this.validCredentials = 0;
  }

  save(): void{
    console.log("LOGIN ISVALID: ",this.loginForm.valid);
    
    if (this.loginForm.valid) {
      const params = this.loginForm.value;
      // params['registrador_id'] = params['registrador']['id'];
      this.isLoggingIn = true;
      //console.log(params);
      this.store.dispatch(new SignIn( params.name, params.password)).subscribe( (data) => {
        // Animación de carga de Iniciando sesión...
        this.validCredentials = 1;
        console.log('Inicio de sesión exitoso');
        //console.log(data);
        this.startSession();
        /* this.userService.setUserInLocalStorage();
        this.router.navigate(['/panel'], {
          state: {
            //flag para mostrar toast de bienvenida
            recentLogIn: true,
          }
        });
        this.eventSocketService.listen(); */
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
        //console.log(error.error.error);
        this.validCredentials = -1;
      });

      // let categoria = <Categoria>params;
      // this.confirmSave(categoria);
    }else{

    }
  }

  async startSession(){
    console.log("starting SESION");
    
    await this.userService.setUserInLocalStorage();
    this.router.navigate(['/panel'], {
      state: {
        //flag para mostrar toast de bienvenida
        recentLogIn: true,
      }
    });
    this.eventSocketService.user_id = localStorage.getItem('user_id');
    this.vehicleService.initialize();
    this.eventService.getAll();
    this.eventSocketService.listen();
    this.userDataService.getUserData();
  }
}
