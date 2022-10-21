import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PanelService } from '../../services/panel.service';
import { EventSocketService } from './../../../events/services/event-socket.service';

import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { EventService } from 'src/app/events/services/event.service';

declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  logo:string = "assets/images/logo-gl-tracker-blue-dark.svg";
  sidevarIZ:boolean=true;
  logOutModalDisplay: boolean = false;
  windowAccess = window;

  userName: string = '';
  userEmail: string = '';
  userDataInitialized: boolean = false;

  userData: any; //Informacion del usuario
  showBtnSubcuentas = true;

  constructor(
    private router: Router,
    public eventService: EventService,
    public eventSocketService : EventSocketService,
    public panelService: PanelService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.http.post<any>(environment.apiUrl + '/api/userData', {}).subscribe({
      next: data => {
        this.userData = this.panelService.userData = data[0];
        this.showBtnSubcuentas = this.userData.privilegios == "subusuario"? false: true;

        this.userName = data[0].nombre_usuario.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').replace(/  +/g, ' ').trim();
        this.userEmail = data[0].email;
        this.userDataInitialized = true;
      },
      error: () => {
        console.log('No se pudo obtener datos del usuario');
      }});
  }

  showHideSideBar(): void {

    //console.log("Mostrar-Esconder sidebar");
    if(this.sidevarIZ){
      $("#panel_sidebar").hide( "slow" );
      $("#panelMonitoreo").hide( "slow" );

      this.sidevarIZ = false;
    } else {
      $("#panel_sidebar").show( "slow" );
      this.sidevarIZ = true;
    }

  }

  logOut(): void {
    

    this.panelService.activity_logout({id:'477'}).then(()=>{
      console.log('cerrar sesion');
    });
    localStorage.clear();
    /* this.router.navigate(['']); */
    window.location.reload();
  };

}
