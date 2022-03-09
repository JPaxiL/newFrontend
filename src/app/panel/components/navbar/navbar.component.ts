import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventSocketService } from './../../../events/services/event-socket.service';


declare var $: any;


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  logo:string = "assets/images/navbar/logo-gltracker.svg";
  sidevarIZ:boolean=true;
  logOutModalIsOpen = false;

  constructor(
    private router: Router,
    public eventSocketService : EventSocketService
  ) { }

  ngOnInit(): void {
  }



  showHideSideBar(): void {

    console.log("Mostrar-Esconder sidebar");
    if(this.sidevarIZ){
      $("#panel_sidebar").hide( "slow" );
      $("#panelMonitoreo").hide( "slow" );

      this.sidevarIZ = false;
    } else {
      $("#panel_sidebar").show( "slow" );
      this.sidevarIZ = true;
    }



  }

  closeLogOutModal(): void{
    this.logOutModalIsOpen = false;
  }

  logOut(): void {
    localStorage.clear();
    /* this.router.navigate(['']); */
    window.location.reload();
  };
}
