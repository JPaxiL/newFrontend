import { Component, OnInit } from '@angular/core';

import { GeofencesService } from '../../services/geofences.service';

import { MapServicesService } from '../../../map/services/map-services.service';


@Component({
  selector: 'app-geocerca-lists',
  templateUrl: './geocerca-lists.component.html',
  styleUrls: ['./geocerca-lists.component.scss']
})
export class GeocercaListsComponent implements OnInit {

  tblDataGeo = new Array();
  datosCargados = false;

  constructor(
    public geofencesService: GeofencesService
  ) { }

  ngOnInit(): void {

    console.log("DATOS DE GEOCERCAS");
    // console.log(geocercas);
    this.mostrar_tabla();
  }

  mostrar_tabla() {
      let geos = this.geofencesService.getData();
      console.log(geos);

      this.tblDataGeo = [];

      for (let i = 0; i < geos.length; i++) {
        geos[i].zone_name_visible_bol = (geos[i].zone_name_visible === 'true');
        this.tblDataGeo.push({trama:geos[i]});
      }
      // this.tblDataGeo.push({icono:"assets/images/end.png", trama:dH[dH.length-1],icono_width:"13px",icono_height:"13px"});

  }

  clickLocate(geo:any){
    console.log("localizar una geocerca");
    console.log(geo);
  }

  clickConfigurarGeocerca(id:number) {
    console.log('clickConfigurarGeocerca');
    this.geofencesService.nombreComponente = "AGREGAR";
    console.log(id);
    this.geofencesService.action         = "edit";
    this.geofencesService.idGeocercaEdit = id;



  }

  clickEliminarGeocerca(id:number) {
    console.log('clickEliminarGeocerca');
    console.log(id);
    this.geofencesService.action = "delete";


  }

}
