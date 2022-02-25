import { Component, OnInit } from '@angular/core';

import { GeofencesService } from '../../services/geofences.service';

import Swal from 'sweetalert2';

import { MapServicesService } from '../../../map/services/map-services.service';

import * as L from 'leaflet';

// import { Draw } from 'leaflet-draw';

import 'leaflet-draw';

@Component({
  selector: 'app-geocerca-lists',
  templateUrl: './geocerca-lists.component.html',
  styleUrls: ['./geocerca-lists.component.scss']
})
export class GeocercaListsComponent implements OnInit {

  tblDataGeo = new Array();
  datosCargados = false;
  NomBusqueda = "";

  constructor(
    public geofencesService: GeofencesService,
    public mapService: MapServicesService,

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

  clickLocate(id:number){
    console.log("localizar una geocerca");
    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];
    console.log(geo);

    this.mapService.map.fitBounds(geo.geo_elemento.getBounds(), {
      padding: [50, 50]
    });
  }


  clickShow(id:number){
    console.log("localizar una geocerca");
    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];

    console.log(geo);

    if (geo.zone_visible == "true") {

      geo.zone_visible  = "false";
      this.mapService.map.removeLayer(geo.geo_elemento);
    } else {

      geo.zone_visible  = "true";
      geo.geo_elemento.addTo(this.mapService.map);
    }

  }

  clickShowNameGeocerca(id:number){
    console.log("Mostrar/Ocultar nombre");
    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];

    console.log(geo);

    if (geo.zone_name_visible == "true") {

      geo.zone_name_visible  = "false";
      geo.zone_name_visible_bol = false;

      this.mapService.map.removeLayer(geo.marker_name);
    } else {

      geo.zone_name_visible  = "true";
      geo.zone_name_visible_bol = true;

      geo.marker_name.addTo(this.mapService.map);
    }



  }

  clickConfigurarGeocerca(id:number) {
    console.log('clickConfigurarGeocerca');
    this.geofencesService.nombreComponente = "AGREGAR";
    console.log(id);
    this.geofencesService.action         = "edit";
    this.geofencesService.idGeocercaEdit = id;



  }

  clickEliminarGeocerca(event:any, id:number) {
    console.log('clickEliminarGeocerca');
    console.log(id);
    this.geofencesService.action = "delete";

    event.preventDefault();
    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];


    Swal.fire({
        title: '¿Está seguro?',
        text: `¿Está seguro que desea eliminar ${geo.zone_name}?`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        preConfirm:async () => {
          const res = await this.geofencesService.delete(id);
          // this.deleteAlert.emit();
          // this.clickShowPanel(this.nameComponent);

          this.mapService.map.removeLayer(geo.geo_elemento);

          for (var i = 0; i < this.geofencesService.geofences.length; i++) {
            if (this.geofencesService.geofences[i].id === id) {
              this.geofencesService.geofences.splice(i, 1);
              i--;
            }
          }
          this.mostrar_tabla();

        }
    }).then(data => {
      if(data.isConfirmed){
        Swal.fire(
          'Eliminado',
          'Los datos se eliminaron correctamente!!',
          'success'
        );
      }
    });


  }

  clickAgregarGeocerca() {
    this.geofencesService.nombreComponente = "AGREGAR";
    this.geofencesService.action         = "add";

  }

  onBusqueda(gaaa:any) {
    console.log(gaaa);
    console.log(this.NomBusqueda);

    let geos = this.geofencesService.getData();
    console.log(geos);

    this.tblDataGeo = [];

    for (let i = 0; i < geos.length; i++) {

        if ( geos[i].orden.toUpperCase().includes(this.NomBusqueda.toUpperCase()) ) {
            geos[i].zone_name_visible_bol = (geos[i].zone_name_visible === 'true');
            this.tblDataGeo.push({trama:geos[i]});
        }

    }
    // this.tblDataGeo.push({icono:"assets/images/end.png", trama:dH[dH.length-1],icono_width:"13px",icono_height:"13px"});
  }



}
