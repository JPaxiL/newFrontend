import { Component, OnInit } from '@angular/core';

declare var $: any;


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  logo:string = "assets/images/navbar/logo-gltracker.svg";
  sidevarIZ:boolean=true;

  constructor() { }

  ngOnInit(): void {
  }



  showHideSideBar(): void {

    console.log("Mostrar-Esconder sidebar");
    if(this.sidevarIZ){
      $("#panel_sidebar").hide( "slow" );
      this.sidevarIZ = false;
    } else {
      $("#panel_sidebar").show( "slow" );
      this.sidevarIZ = true;
    }



  }
}
