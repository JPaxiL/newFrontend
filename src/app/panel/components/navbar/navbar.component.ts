import { Component, OnInit } from '@angular/core';
import { PanelService } from '../../services/panel.service';
import { EventSocketService } from './../../../events/services/event-socket.service';

import { EventService } from 'src/app/events/services/event.service';
import { UserDataService } from 'src/app/profile-config/services/user-data.service';
import { TabService } from '../../services/tab.service';

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
  showBtnSubcuentas = false;
  showBtnDrivers =true;
  showMultiviewModal = false;
  constructor(
    public eventService: EventService,
    public eventSocketService : EventSocketService,
    public panelService: PanelService,
    private userDataService: UserDataService,
    private tabService: TabService,
  ) { 
    this.tabService.setCurrentTab('main-panel');
  }

  ngOnInit(): void {
    if(!this.userDataService.userDataInitialized){
      console.log('(Navbar) User Data no está listo. Subscribiendo para obtener data...');
      this.userDataService.userDataCompleted.subscribe({
        next: (result: boolean) => {
          if(result){
            this.getUserData();
          }
        },
        error: (errMsg: any) => {
          console.log('(Navbar) Error al obtener userData: ', errMsg);
        }
      });
    } else {
      console.log('(Navbar) User Data está listo. Subscribiendo para obtener data...');
      this.getUserData();
    }

    $('[data-bs-toggle="tooltip"]').click(function(){
      $('[data-bs-toggle="tooltip"]').tooltip('hide');
    });
    
    $('.dropdown-menu li').hover(() =>{
      $(".tooltip").css("display", "none");
    });
  }
  

  getUserData(){
    this.userName = this.userDataService.userData.nombre_usuario.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').replace(/  +/g, ' ').trim();
    this.userEmail = this.userDataService.userData.email;
    this.userDataInitialized = true;
    if(!this.isSubuser()){
      this.showBtnSubcuentas = true;
    }
  }

  isSubuser(){
    return this.userDataService.userData.privilegios == "subusuario";
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

  clickShowModalMultiview(){
    this.panelService.nombreComponente = "MULTIVIEW";
    $("#panelMonitoreo").hide( "slow" );
    this.showMultiviewModal = true;
  }
  onHideMultiviewModal(){
    this.panelService.nombreComponente = "";
    this.showMultiviewModal = false;
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
