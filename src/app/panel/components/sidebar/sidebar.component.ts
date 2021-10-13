import { Component, OnInit } from '@angular/core';
import { PanelService } from '../../services/panel.service';

declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor( public panelService: PanelService ) { }

  options = new Array(
    { id:'GEOPOINTS' , name:"Geopunto"},
    { id:'HISTORIAL' , name:"Historial"},
    { id:'VEHICLES' , name:"Vehículos"},
  );



  ngOnInit(): void {
  }


  clickShowPanel( nomComponent:string ): void {

    $("#panelMonitoreo").show( "slow" );
    this.panelService.nombreComponente = nomComponent;

    const item = this.options.filter((item)=> item.id == nomComponent);
    this.panelService.nombreCabecera =   item[0].name;

  }




}
