import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PanelService } from '../../services/panel.service';
import { EventSocketService } from './../../../events/services/event-socket.service';

import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    private router: Router,
    public eventSocketService : EventSocketService,
    public panelService: PanelService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.http.post<any>(environment.apiUrl + '/api/userData', {}).subscribe({
      next: data => {
        this.userName = data[0].nombre_usuario.normalize('NFKD').replace(/[^a-zA-ZñÑ0-9 ]+/g, '').replace(/  +/g, ' ').trim();
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
    localStorage.clear();
    /* this.router.navigate(['']); */
    window.location.reload();
  };

}
