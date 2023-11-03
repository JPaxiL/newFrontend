import { Component, OnInit } from '@angular/core';
import { MapServicesService } from 'src/app/map/services/map-services.service';
import { CircularGeofencesService } from '../../services/circular-geofences.service';
import * as L from 'leaflet';
import Swal from 'sweetalert2';
import { Geofences } from '../../models/geofences';
import { IGeofence } from '../../models/interfaces';

@Component({
  selector: 'app-geocerca-circular-lists',
  templateUrl: './geocerca-circular-lists.component.html',
  styleUrls: ['./geocerca-circular-lists.component.scss']
})
export class GeocercaCircularListsComponent implements OnInit {

  NomBusqueda: string = "";
  noResults: boolean = false;
  objGeofences= new Geofences();
  treeGeofences: any;

  constructor(private circularGeofencesService: CircularGeofencesService,
              private mapService: MapServicesService) { }

  ngOnInit(): void {
    if(!this.circularGeofencesService.initializingCircularGeofences || !this.circularGeofencesService.initializingUserPrivleges){
      this.circularGeofencesService.spinner.show('loadingCircularGeofencesSpiner');
    }
    if(this.circularGeofencesService.initializingCircularGeofences){
      this.objGeofences.setGeofences(this.circularGeofencesService.circular_geofences as IGeofence[]);
    }else{
      this.circularGeofencesService.dataCompleted.subscribe((data:IGeofence[])=>{
        this.objGeofences.setGeofences(data);
      })
    }
    this.treeGeofences = this.objGeofences.createTreeNode();
  }

  get tblDataGeoFiltered(){
    return this.circularGeofencesService.tblDataGeoFiltered;
  }

  get showBtnAdd(){
    return this.circularGeofencesService.showBtnAdd;
  }

  get showBtnEdit(){
    return this.circularGeofencesService.showBtnEdit;
  }

  get eyeInputSwitch(){
    return this.circularGeofencesService.eyeInputSwitch;
  }

  set eyeInputSwitch(value: boolean){
    this.circularGeofencesService.eyeInputSwitch = value;
  }

  get tagNamesEyeState(){
    return this.circularGeofencesService.tagNamesEyeState;
  }

  onBusqueda() {
    if(this.NomBusqueda == ''){
      this.circularGeofencesService.tblDataGeoFiltered = this.circularGeofencesService.getTableData();
      this.noResults = false;
    } else {
      this.circularGeofencesService.tblDataGeoFiltered = this.circularGeofencesService.getTableData().filter( (geocerca: any) => {
        return geocerca.trama.orden != null && geocerca.trama.orden.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').toUpperCase().includes(this.NomBusqueda.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').toUpperCase());
      });
      this.noResults = this.circularGeofencesService.tblDataGeoFiltered.length == 0;
    }
  }

  clickShowNameGeocerca(id:number, comesFromInputSwitch?: boolean){
    
    var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == id)[0];

    if (geo.zone_name_visible == true) {

      geo.zone_name_visible  = false;
      geo.zone_name_visible_bol = false;

      this.mapService.map.removeLayer(geo.marker_name);
    } else {

      geo.zone_name_visible  = true;
      geo.zone_name_visible_bol = true;

      geo.marker_name.addTo(this.mapService.map);
    }

    this.circularGeofencesService.updateGeoTagCounters();

    if(typeof comesFromInputSwitch == 'undefined' || !comesFromInputSwitch){
      this.circularGeofencesService.tagNamesEyeState = (this.circularGeofencesService.circularGeofenceTagCounters.visible != 0);
    }

  }

  clickShow(id:number, comesFromInputSwitch?: boolean){

    let geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == id)[0];

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

    this.circularGeofencesService.updateGeoCounters();
    this.circularGeofencesService.updateGeoTagCounters();

    if(typeof comesFromInputSwitch == 'undefined' || !comesFromInputSwitch){
      let auxIndex = -1;
      
      this.circularGeofencesService.eyeInputSwitch = (this.circularGeofencesService.circularGeofenceCounters.visible != 0);

      if(geo.zone_visible == true){

        for(let i = this.circularGeofencesService.circular_geofences.length - 1; i > -1; i--){

          this.circularGeofencesService.clearDrawingsOfGeofence(this.circularGeofencesService.circular_geofences[i]);
          if(this.circularGeofencesService.circular_geofences[i].id == id){
            auxIndex = i;
            i = -1;
          }
        }

        for(let i = auxIndex; i < this.circularGeofencesService.circular_geofences.length; i++){
          this.circularGeofencesService.showDrawingsOfGeofence(this.circularGeofencesService.circular_geofences[i]);
          
        }
      }
    }

  }

  onClickEye(){
    let ciruclarGeofencesList = this.circularGeofencesService.circular_geofences.map( (circular_geofence: { id: number, zone_visible: boolean }) => { 
      return { 
        id: circular_geofence.id, visible: circular_geofence.zone_visible
      }; 
    });

    ciruclarGeofencesList.forEach((circular_geofence: { id: number, visible: boolean }) => {
      if((circular_geofence.visible == true) != this.eyeInputSwitch){
        this.clickShow(circular_geofence.id, true);
      }
    });

    for(let i = 0; i < this.circularGeofencesService.circular_geofences.length; i++){
      this.circularGeofencesService.clearDrawingsOfGeofence(this.circularGeofencesService.circular_geofences[i]);
    }
    for(let i = 0; i < this.circularGeofencesService.circular_geofences.length; i++){
      this.circularGeofencesService.showDrawingsOfGeofence(this.circularGeofencesService.circular_geofences[i]);
      
    }
  }

  onClickTagNamesEye(){
    this.circularGeofencesService.tagNamesEyeState = !this.tagNamesEyeState;
    let circularGeofencesList = this.circularGeofencesService.circular_geofences.map( (circular_geofence: { id: number, zone_name_visible: boolean }) => { 
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
    var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == id)[0];
    
    this.mapService.map.panTo(new L.LatLng(geo.geo_elemento._latlng.lat, geo.geo_elemento._latlng.lng));
  }

  clickAgregarGeocerca() {
    this.circularGeofencesService.nameComponentCirc = "AGREGAR";
    this.circularGeofencesService.action = "add";

  }

  clickConfigurarGeocerca(id:number) {
    this.circularGeofencesService.nameComponentCirc = "AGREGAR";
    this.circularGeofencesService.action         = "edit";
    this.circularGeofencesService.idGeocercaEdit = id;
  }

  clickEliminarGeocerca(id:number) {

    this.circularGeofencesService.action = "delete";

    var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == id)[0];

    Swal.fire({
        title: '¿Está seguro?',
        text: `¿Está seguro que desea eliminar ${geo.zone_name}?`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        preConfirm:async () => {
          
          await this.circularGeofencesService.delete(id);

          this.mapService.map.removeLayer(geo.geo_elemento);
            this.mapService.map.removeLayer(geo.marker_name);
  
            for (var i = 0; i < this.circularGeofencesService.circular_geofences.length; i++) {
              if (this.circularGeofencesService.circular_geofences[i].id === id) {
                this.circularGeofencesService.circular_geofences.splice(i, 1);
                i--;
              }
            }
            this.circularGeofencesService.initializeTable();
            this.circularGeofencesService.updateGeoCounters();
            this.circularGeofencesService.updateGeoTagCounters();
            this.circularGeofencesService.eyeInputSwitch = (this.circularGeofencesService.circularGeofenceCounters.visible != 0);
            this.circularGeofencesService.tagNamesEyeState = (this.circularGeofencesService.circularGeofenceTagCounters.visible != 0);
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
