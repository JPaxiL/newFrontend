import { Component, OnInit } from '@angular/core';

import { GeopointsService } from '../../services/geopoints.service';

@Component({
  selector: 'app-panel-geopoints',
  templateUrl: './panel-geopoints.component.html',
  styleUrls: ['./panel-geopoints.component.scss']
})
export class PanelGeopointsComponent implements OnInit {

  //alerts:Alert[] = [];
  options = new Array(

    { id:'LISTAR' , name:"Listar"},
    { id:'AGREGAR' , name:"Agregar"},
    { id:'EDITAR' , name:"Editar"},

  );


  constructor(
    // public mapService: MapServicesService,
    public geopointsService: GeopointsService

    ) {};


  ngOnInit(): void {

    this.geopointsService.nombreComponente =  "LISTAR";

  }


}
