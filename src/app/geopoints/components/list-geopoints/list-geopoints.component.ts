import { Component, OnInit } from '@angular/core';

import { GeopointsService } from '../../services/geopoints.service';
import { MapServicesService } from '../../../map/services/map-services.service';

import { PanelService } from '../../../panel/services/panel.service';

import Swal from 'sweetalert2';
import * as L from 'leaflet';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list-geopoints',
  templateUrl: './list-geopoints.component.html',
  styleUrls: ['./list-geopoints.component.scss']
})
export class ListGeopointsComponent implements OnInit {

  datosCargados = false;
  NomBusqueda = "";

  userData: any; //Informacion del usuario
  showBtnAdd = true;
  showBtnEdit = true;
  noResults: boolean = false;

  constructor(
    public geopointsService: GeopointsService,
    public mapService: MapServicesService,
    public panelService: PanelService,

  ) {}

  ngOnInit(): void {

    this.userData = this.panelService.userData;
    console.log(this.userData);
    if (this.userData.privilegios == "subusuario") {
        // console.log("es sub usuario");
        this.showBtnAdd = false;
        this.showBtnEdit = false;
    } else {
        // console.log("es un usuario normal");
        // this.showBtnAdd = true;

    }

    if(!this.geopointsService.initializingGeopoints){
      this.geopointsService.spinner.show('loadingGeopointsSpinner');
    }
    console.log("DATOS DE GEOPUNTOS");
    //this.mostrar_tabla();

  }

  /* mostrar_tabla() {
    let geos = this.geopointsService.getData();
    console.log(geos);

    this.tblDataGeo = [];

    for (let i = 0; i < geos.length; i++) {
      geos[i].geopunto_nombre_visible_bol = (geos[i].geopunto_nombre_visible === 'true');
      geos[i].geopunto_visible_bol = (geos[i].geopunto_visible === 'true');


      this.tblDataGeo.push({trama:geos[i]});
    }
    // this.tblDataGeo.push({icono:"assets/images/end.png", trama:dH[dH.length-1],icono_width:"13px",icono_height:"13px"});
  } */

  clickLocate(id:number){
    console.log("localizar un GEOPUNTO");
    console.log(id);
    var geo = this.geopointsService.geopoints.filter((item:any)=> item.geopunto_id == id)[0];
    console.log(geo);
    console.log(geo.geo_elemento.getLatLng());

    // var latlng = this.geopoints[i].geopunto_vertices.split(",")
    //bounds.push([parseFloat(latlng[0]), parseFloat(latlng[1])]);

    this.mapService.map.fitBounds([geo.geo_elemento.getLatLng()], {
      padding: [50, 50]
    });
  }


  clickShow(id:number, comesFromInputSwitch?: boolean){
    console.log("localizar una geo punto");
    console.log(id);

    var geo = this.geopointsService.geopoints.filter((item:any)=> item.geopunto_id == id)[0];

    console.log(geo);

    if (geo.geopunto_visible == "true") {

      geo.geopunto_visible  = "false";
      this.mapService.map.removeLayer(geo.geo_elemento);

      if(geo.geopunto_nombre_visible_bol){
        geo.geopunto_nombre_visible_bol = false;
        this.clickShowNameGeocerca(id);
      }
    } else {

      geo.geopunto_visible  = "true";
      geo.geo_elemento.addTo(this.mapService.map);

      if(!geo.geopunto_nombre_visible_bol){
        geo.geopunto_nombre_visible_bol = true;
        this.clickShowNameGeocerca(id);
      }
    }

    this.geopointsService.updateGeoCounters();

    if(typeof comesFromInputSwitch == 'undefined' || !comesFromInputSwitch){
      this.geopointsService.eyeInputSwitch = this.geopointsService.geopointCounters.visible != 0;
    }

  }

  clickShowNameGeocerca(id:number){
    console.log("Mostrar/Ocultar nombre");
    var geo = this.geopointsService.geopoints.filter((item:any)=> item.geopunto_id == id)[0];

    console.log(geo);

    if (geo.geopunto_nombre_visible == "true") {

      geo.geopunto_nombre_visible  = "false";
      geo.geopunto_nombre_visible_bol = false;

      this.mapService.map.removeLayer(geo.marker_name);
    } else {

      geo.geopunto_nombre_visible  = "true";
      geo.geopunto_nombre_visible_bol = true;

      geo.marker_name.addTo(this.mapService.map);
    }



  }

  clickConfigurarGeopunto(id:number) {
    console.log('clickConfigurarGeocerca');
    this.geopointsService.nombreComponente = "AGREGAR";
    console.log(id);
    this.geopointsService.action         = "edit";
    this.geopointsService.idGeopointEdit = id;



  }

  clickEliminarGeopunto(event:any, id:number) {
    console.log('clickEliminarGeopunto');
    console.log(id);
    this.geopointsService.action = "delete";

    event.preventDefault();
    var geo = this.geopointsService.geopoints.filter((item:any)=> item.geopunto_id == id)[0];


    Swal.fire({
        title: '¿Está seguro?',
        text: `¿Está seguro que desea eliminar ${geo.geopunto_name}?`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        preConfirm:async () => {
          const res = await this.geopointsService.delete(id);
          // this.deleteAlert.emit();
          // this.clickShowPanel(this.nameComponent);

          this.mapService.map.removeLayer(geo.geo_elemento);
          this.mapService.map.removeLayer(geo.marker_name);

          for (var i = 0; i < this.geopointsService.geopoints.length; i++) {
            if (this.geopointsService.geopoints[i].geopunto_id === id) {
              this.geopointsService.geopoints.splice(i, 1);
              i--;
            }
          }
          //this.mostrar_tabla();
          this.geopointsService.initializeTable();
          this.geopointsService.updateGeoCounters();
          this.geopointsService.eyeInputSwitch = this.geopointsService.geopointCounters.visible != 0;

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

  clickAgregarGeopunto() {
    this.geopointsService.nombreComponente = "AGREGAR";
    this.geopointsService.action         = "add";

  }

  onBusqueda(gaaa:any) {
    if(this.NomBusqueda == ''){
      this.geopointsService.tblDataGeoFiltered = this.geopointsService.getTabledata();
      this.noResults = false;
    } else {
      this.geopointsService.tblDataGeoFiltered = this.geopointsService.getTabledata().filter( (geopunto: any) => {
        return geopunto.trama.geopunto_name != null && geopunto.trama.geopunto_name.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').toUpperCase().includes(this.NomBusqueda.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').toUpperCase());
      });
      this.noResults = this.geopointsService.tblDataGeoFiltered.length == 0;
    }
  }

  onClickEye(){
    var geopointsList = this.geopointsService.geopoints.map( (geopoint: { geopunto_id: number, geopunto_visible: string }) =>
      { return { id: geopoint.geopunto_id, visible: geopoint.geopunto_visible}; } );
    geopointsList.forEach((geopoint: { id: number, visible: string }) => {
      if((geopoint.visible == 'true') != this.geopointsService.eyeInputSwitch){
        this.clickShow(geopoint.id, true);
      }
    });
  }

}
