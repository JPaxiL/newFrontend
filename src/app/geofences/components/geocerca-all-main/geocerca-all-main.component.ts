import { Component, OnInit } from '@angular/core';

// import { MapServicesService } from '../../../map/services/map-services.service';

import { GeofencesService } from '../../services/geofences.service';

@Component({
  selector: 'app-geocerca-all-main',
  templateUrl: './geocerca-all-main.component.html',
  styleUrls: ['./geocerca-all-main.component.scss']
})
export class GeocercaAllMainComponent implements OnInit {

  //alerts:Alert[] = [];
  options = new Array(

    { id:'LISTAR' , name:"Listar"},
    { id:'AGREGAR' , name:"Agregar"},
    { id:'EDITAR' , name:"Editar"},

  );


  constructor(
    // public mapService: MapServicesService,
    public geofencesService: GeofencesService

    ) {};


  ngOnInit(): void {

    this.geofencesService.nombreComponente =  "LISTAR";

  }

}
