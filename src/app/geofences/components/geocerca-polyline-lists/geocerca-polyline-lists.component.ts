import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapServicesService } from 'src/app/map/services/map-services.service';
import Swal from 'sweetalert2';
import { PolylineGeogencesService } from '../../services/polyline-geogences.service';
import { Geofences } from '../../models/geofences';
import { IGeofence } from '../../models/interfaces';

@Component({
  selector: 'app-geocerca-polyline-lists',
  templateUrl: './geocerca-polyline-lists.component.html',
  styleUrls: ['./geocerca-polyline-lists.component.scss']
})
export class GeocercaPolylineListsComponent implements OnInit {

  NomBusqueda: string = "";
  noResults: boolean = false;
  objGeofences= new Geofences();
  treeGeofences: any;

  constructor(private mapService: MapServicesService,
            private polylineGeofenceService: PolylineGeogencesService) { }

  ngOnInit(): void {
    if(!this.polylineGeofenceService.initializingPolylineGeofences || !this.polylineGeofenceService.initializingUserPrivleges){
      this.polylineGeofenceService.spinner.show('loadingPolylineGeofencesSpiner');
    }
    if(this.polylineGeofenceService.initializingPolylineGeofences){
      this.objGeofences.setGeofences(this.polylineGeofenceService.polyline_geofences as IGeofence[]);
    }else{
      this.polylineGeofenceService.dataCompleted.subscribe((data:IGeofence[])=>{
        this.objGeofences.setGeofences(data);
      })
    }
    this.treeGeofences = this.objGeofences.createTreeNode();
  }


  get tblDataGeoFiltered(){

    return this.polylineGeofenceService.tblDataGeoFiltered;
  }

  get showBtnAdd(){
    return this.polylineGeofenceService.showBtnAdd;
  }

  get showBtnEdit(){
    return this.polylineGeofenceService.showBtnEdit;
  }

  get eyeInputSwitch(){
    return this.polylineGeofenceService.eyeInputSwitch;
  }

  set eyeInputSwitch(value: boolean){
    this.polylineGeofenceService.eyeInputSwitch = value;
  }

  get tagNamesEyeState(){
    return this.polylineGeofenceService.tagNamesEyeState;
  }

  onBusqueda() {
    if(this.NomBusqueda == ''){
      this.polylineGeofenceService.tblDataGeoFiltered = this.polylineGeofenceService.getTableData();
      this.noResults = false;
    } else {
      this.polylineGeofenceService.tblDataGeoFiltered = this.polylineGeofenceService.getTableData().filter( (geocerca: any) => {
        return geocerca.trama.orden != null && geocerca.trama.orden.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').toUpperCase().includes(this.NomBusqueda.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').toUpperCase());
      });
      this.noResults = this.polylineGeofenceService.tblDataGeoFiltered.length == 0;
    }
  }

  clickShowNameGeocerca(id:number, comesFromInputSwitch?: boolean){
    
    var geo = this.polylineGeofenceService.polyline_geofences.filter((item:any)=> item.id == id)[0];

    if (geo.zone_name_visible == true) {

      geo.zone_name_visible  = false;
      geo.zone_name_visible_bol = false;

      this.mapService.map.removeLayer(geo.marker_name);
    } else {

      geo.zone_name_visible  = true;
      geo.zone_name_visible_bol = true;

      geo.marker_name.addTo(this.mapService.map);
    }

    this.polylineGeofenceService.updateGeoTagCounters();

    if(typeof comesFromInputSwitch == 'undefined' || !comesFromInputSwitch){
      this.polylineGeofenceService.tagNamesEyeState = (this.polylineGeofenceService.polylineGeofenceTagCounters.visible != 0);
    }

  }

  clickShow(id:number, comesFromInputSwitch?: boolean){

    let geo = this.polylineGeofenceService.polyline_geofences.filter((item:any)=> item.id == id)[0];

    if (geo.zone_visible == true) {

      geo.zone_visible  = false;
      this.mapService.map.removeLayer(geo.geo_elemento);

      if(geo.zone_name_visible == true){
        this.clickShowNameGeocerca(id);
      }
    } else {

      geo.zone_visible  = true;
      geo.geo_elemento.addTo(this.mapService.map);

    }

    this.polylineGeofenceService.updateGeoCounters();
    this.polylineGeofenceService.updateGeoTagCounters();

    if(typeof comesFromInputSwitch == 'undefined' || !comesFromInputSwitch){
      let auxIndex = -1;
      
      this.polylineGeofenceService.eyeInputSwitch = (this.polylineGeofenceService.polylineGeofenceCounters.visible != 0);

      if(geo.zone_visible == true){

        for(let i = this.polylineGeofenceService.polyline_geofences.length - 1; i > -1; i--){

          this.polylineGeofenceService.clearDrawingsOfGeofence(this.polylineGeofenceService.polyline_geofences[i]);
          if(this.polylineGeofenceService.polyline_geofences[i].id == id){
            auxIndex = i;
            i = -1;
          }
        }

        for(let i = auxIndex; i < this.polylineGeofenceService.polyline_geofences.length; i++){
          this.polylineGeofenceService.showDrawingsOfGeofence(this.polylineGeofenceService.polyline_geofences[i]);
          
        }
      }
    }

  }

  onClickEye(){
    let ciruclarGeofencesList = this.polylineGeofenceService.polyline_geofences.map( (circular_geofence: { id: number, zone_visible: boolean }) => { 
      return { 
        id: circular_geofence.id, visible: circular_geofence.zone_visible
      }; 
    });

    ciruclarGeofencesList.forEach((circular_geofence: { id: number, visible: boolean }) => {
      if((circular_geofence.visible == true) != this.eyeInputSwitch){
        this.clickShow(circular_geofence.id, true);
      }
    });

    for(let i = 0; i < this.polylineGeofenceService.polyline_geofences.length; i++){
      this.polylineGeofenceService.clearDrawingsOfGeofence(this.polylineGeofenceService.polyline_geofences[i]);
    }
    for(let i = 0; i < this.polylineGeofenceService.polyline_geofences.length; i++){
      this.polylineGeofenceService.showDrawingsOfGeofence(this.polylineGeofenceService.polyline_geofences[i]);
      
    }
  }

  onClickTagNamesEye(){
    this.polylineGeofenceService.tagNamesEyeState = !this.tagNamesEyeState;
    let circularGeofencesList = this.polylineGeofenceService.polyline_geofences.map( (circular_geofence: { id: number, zone_name_visible: boolean }) => { 
      return { 
        id: circular_geofence.id, 
        tag_visible: circular_geofence.zone_name_visible}; 
      });
    
      circularGeofencesList.forEach((circular_geofence: { id: number, tag_visible: boolean }) => {
      if((circular_geofence.tag_visible == true) != this.tagNamesEyeState){
        this.clickShowNameGeocerca(circular_geofence.id, true);
      }
    });
  }

  clickLocate(id:number){
    const geo = this.polylineGeofenceService.polyline_geofences.filter((item:any)=> item.id == id)[0];

    this.mapService.map.fitBounds(geo.geo_elemento.getBounds(), {
      padding: [50, 50]
    });
  }

  clickAgregarGeocerca() {
    this.polylineGeofenceService.nombreComponente = "AGREGAR";
    this.polylineGeofenceService.action = "add";

  }

  clickConfigurarGeocerca(id:number) {
    this.polylineGeofenceService.nombreComponente = "AGREGAR";
    this.polylineGeofenceService.action         = "edit";
    this.polylineGeofenceService.idGeocercaEdit = id;
  }

  clickEliminarGeocerca(id:number) {

    this.polylineGeofenceService.action = "delete";

    var geo = this.polylineGeofenceService.polyline_geofences.filter((item:any)=> item.id == id)[0];

    Swal.fire({
        title: '¿Está seguro?',
        text: `¿Está seguro que desea eliminar ${geo.zone_name}?`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        preConfirm:async () => {
          
          await this.polylineGeofenceService.delete(id);

          this.mapService.map.removeLayer(geo.geo_elemento);
            this.mapService.map.removeLayer(geo.marker_name);
  
            for (var i = 0; i < this.polylineGeofenceService.polyline_geofences.length; i++) {
              if (this.polylineGeofenceService.polyline_geofences[i].id === id) {
                this.polylineGeofenceService.polyline_geofences.splice(i, 1);
                i--;
              }
            }
            this.polylineGeofenceService.initializeTable();
            this.polylineGeofenceService.updateGeoCounters();
            this.polylineGeofenceService.updateGeoTagCounters();
            this.polylineGeofenceService.eyeInputSwitch = (this.polylineGeofenceService.polylineGeofenceCounters.visible != 0);
            this.polylineGeofenceService.tagNamesEyeState = (this.polylineGeofenceService.polylineGeofenceTagCounters.visible != 0);
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

}
