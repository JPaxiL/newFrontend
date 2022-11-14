import { Component, OnInit } from '@angular/core';

import { GeofencesService } from '../../services/geofences.service';

import { PanelService } from '../../../panel/services/panel.service';

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

  datosCargados = false;
  NomBusqueda = "";

  noResults: boolean = false;

  constructor(
    public geofencesService: GeofencesService,
    public mapService: MapServicesService,
    public panelService: PanelService,
  ) { }

  ngOnInit(): void {

    if(!this.geofencesService.initializingGeofences || !this.geofencesService.initializingUserPrivleges){
      this.geofencesService.spinner.show('loadingGeofencesSpinner');
    }
    //console.log("DATOS DE GEOCERCAS");
    // //console.log(geocercas);
    //this.mostrar_tabla();
  }

  /* mostrar_tabla() {
      let geos = this.geofencesService.getData();
      console.log(geos);

      this.tblDataGeo = [];

      for (let i = 0; i < geos.length; i++) {
        geos[i].zone_name_visible_bol = (geos[i].zone_name_visible === 'true');
        this.tblDataGeo.push({trama:geos[i]});
      }
      // this.tblDataGeo.push({icono:"assets/images/end.png", trama:dH[dH.length-1],icono_width:"13px",icono_height:"13px"});

  } */

  clickLocate(id:number){
    //console.log("localizar una geocerca");
    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];
    //console.log(geo);

    this.mapService.map.fitBounds(geo.geo_elemento.getBounds(), {
      padding: [50, 50]
    });
  }


  clickShow(id:number, comesFromInputSwitch?: boolean){
    //console.log("localizar una geocerca");
    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];

    //console.log(geo);

    if (geo.zone_visible == "true") {

      geo.zone_visible  = "false";
      this.mapService.map.removeLayer(geo.geo_elemento);

      if(geo.zone_name_visible == 'true'){
        this.clickShowNameGeocerca(id);
      }
    } else {

      geo.zone_visible  = "true";
      geo.geo_elemento.addTo(this.mapService.map);

      /* if(geo.zone_name_visible == 'false'){
        this.clickShowNameGeocerca(id);
      } */
    }

    this.geofencesService.updateGeoCounters();
    this.geofencesService.updateGeoTagCounters();

    if(typeof comesFromInputSwitch == 'undefined' || !comesFromInputSwitch){
      let auxIndex = -1;
      this.geofencesService.eyeInputSwitch = this.geofencesService.geofenceCounters.visible != 0;

      if(geo.zone_visible == "true"){
        console.log('Mostrar una geocerca' + id);
        //Redraw geofences in correct order
        for(let i = this.geofencesService.geofences.length - 1; i > -1; i--){
          //Limpiar geocercas empezando desde la más pequeña, hasta la geocerca que se acaba de mandar show
          this.geofencesService.clearDrawingsOfGeofence(this.geofencesService.geofences[i]);
          if(this.geofencesService.geofences[i].id == id){
            auxIndex = i;
            i = -1;
          }
        }
        //Redibujamos las geocercas empezando desde la que se debe mostrar, hasta la mas pequeña
        for(let i = auxIndex; i < this.geofencesService.geofences.length; i++){
          this.geofencesService.showDrawingsOfGeofence(this.geofencesService.geofences[i]);
        }
      }
    }

  }

  clickShowNameGeocerca(id:number, comesFromInputSwitch?: boolean){
    //console.log("Mostrar/Ocultar nombre");
    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];

    //console.log(geo);

    if (geo.zone_name_visible == "true") {

      geo.zone_name_visible  = "false";
      geo.zone_name_visible_bol = false;

      this.mapService.map.removeLayer(geo.marker_name);
    } else {

      geo.zone_name_visible  = "true";
      geo.zone_name_visible_bol = true;

      geo.marker_name.addTo(this.mapService.map);
    }

    this.geofencesService.updateGeoTagCounters();

    if(typeof comesFromInputSwitch == 'undefined' || !comesFromInputSwitch){
      this.geofencesService.tagNamesEyeState = this.geofencesService.geofenceTagCounters.visible != 0;
    }

  }

  clickConfigurarGeocerca(id:number) {
    //console.log('clickConfigurarGeocerca');
    this.geofencesService.nombreComponente = "AGREGAR";
    //console.log(id);
    this.geofencesService.action         = "edit";
    this.geofencesService.idGeocercaEdit = id;



  }

  clickEliminarGeocerca(event:any, id:number) {
    //console.log('clickEliminarGeocerca');
    //console.log(id);
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
          this.mapService.map.removeLayer(geo.marker_name);

          for (var i = 0; i < this.geofencesService.geofences.length; i++) {
            if (this.geofencesService.geofences[i].id === id) {
              this.geofencesService.geofences.splice(i, 1);
              i--;
            }
          }
          //this.mostrar_tabla();
          this.geofencesService.initializeTable();
          this.geofencesService.updateGeoCounters();
          this.geofencesService.updateGeoTagCounters();
          this.geofencesService.eyeInputSwitch = this.geofencesService.geofenceCounters.visible != 0;
          this.geofencesService.tagNamesEyeState = this.geofencesService.geofenceTagCounters.visible != 0;
          this.onBusqueda();
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

  onBusqueda(gaaa?:any) {
    //console.log(gaaa);
    if(this.NomBusqueda == ''){
      this.geofencesService.tblDataGeoFiltered = this.geofencesService.getTableData();
      this.noResults = false;
    } else {
      this.geofencesService.tblDataGeoFiltered = this.geofencesService.getTableData().filter( (geocerca: any) => {
        return geocerca.trama.orden != null && geocerca.trama.orden.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').toUpperCase().includes(this.NomBusqueda.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').toUpperCase());
      });
      this.noResults = this.geofencesService.tblDataGeoFiltered.length == 0;
    }
    // this.tblDataGeo.push({icono:"assets/images/end.png", trama:dH[dH.length-1],icono_width:"13px",icono_height:"13px"});
  }

  onClickEye(){
    var geofencesList = this.geofencesService.geofences.map( (geofence: { id: number, zone_visible: string }) =>
      { return { id: geofence.id, visible: geofence.zone_visible}; } );
    geofencesList.forEach((geofence: { id: number, visible: string }) => {
      if((geofence.visible == 'true') != this.geofencesService.eyeInputSwitch){
        this.clickShow(geofence.id, true);
      }
    });

    for(let i = 0; i < this.geofencesService.geofences.length; i++){
      this.geofencesService.clearDrawingsOfGeofence(this.geofencesService.geofences[i]);
    }
    for(let i = 0; i < this.geofencesService.geofences.length; i++){
      this.geofencesService.showDrawingsOfGeofence(this.geofencesService.geofences[i]);
    }
  }

  onClickTagNamesEye(){
    this.geofencesService.tagNamesEyeState = !this.geofencesService.tagNamesEyeState;
    var geofencesList = this.geofencesService.geofences.map( (geofence: { id: number, zone_name_visible: string }) =>
      { return { id: geofence.id, tag_visible: geofence.zone_name_visible}; } );
    geofencesList.forEach((geofence: { id: number, tag_visible: string }) => {
      if((geofence.tag_visible == 'true') != this.geofencesService.tagNamesEyeState){
        this.clickShowNameGeocerca(geofence.id, true);
      }
    });
  }

}
