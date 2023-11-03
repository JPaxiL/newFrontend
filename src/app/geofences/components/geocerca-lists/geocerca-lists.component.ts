import { Component, OnInit } from '@angular/core';

import { GeofencesService } from '../../services/geofences.service';
import { CircularGeofencesService } from '../../services/circular-geofences.service';
import { PolylineGeogencesService } from '../../services/polyline-geogences.service';

import { PanelService } from '../../../panel/services/panel.service';

import Swal from 'sweetalert2';
import { TreeNode } from 'primeng-lts/api';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
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

  datosCargados: boolean = false;
  NomBusqueda: string = "";
  noResults: boolean = false;

  geofences: TreeNode[]=[];
  loading: boolean=true;
  cols: any[]=[];
  sortOrder: number=1;


  constructor(
    public geofencesService: GeofencesService,
    public mapService: MapServicesService,
    public panelService: PanelService,
    private circularGeofencesService: CircularGeofencesService,
    private polylineGeofenceService: PolylineGeogencesService,
  ) { }

  ngOnInit(): void {

    if(!this.geofencesService.initializingGeofences || !this.geofencesService.initializingUserPrivleges){
      this.geofencesService.spinner.show('loadingGeofencesSpinner');
    }
    if(!this.polylineGeofenceService.initializingPolylineGeofences || !this.polylineGeofenceService.initializingUserPrivleges){
      this.polylineGeofenceService.spinner.show('loadingPolylineGeofencesSpiner');
    }
    if(!this.circularGeofencesService.initializingCircularGeofences || !this.circularGeofencesService.initializingUserPrivleges){
      this.circularGeofencesService.spinner.show('loadingCircularGeofencesSpiner');
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

  headerScrollHandler(){
    setTimeout(()=> {
      const headerBox = document.querySelector('.p-treetable-scrollable-header-box') as HTMLElement;
      const contentBox = document.querySelector('.p-treetable-tbody') as HTMLElement;
      if(headerBox != null && contentBox != null){
        if(headerBox!.offsetWidth > contentBox!.offsetWidth){
          headerBox!.classList.remove('no-scroll');
        } else {
          headerBox!.classList.add('no-scroll');
        }
      }
    }, 1000);
  }
  //here geocercaCriscular
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

  //here geocerca polyline
    
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
  onBusquedaCirc() {
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

  onBusquedaLin() {
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

  clickShowNameGeocercaCirc(id:number, comesFromInputSwitch?: boolean){
    
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

  clickShowNameGeocercaLin(id:number, comesFromInputSwitch?: boolean){
    
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

  clickLocate(id:number){
    //console.log("localizar una geocerca");
    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];
    //console.log(geo);

    this.mapService.map.fitBounds(geo.geo_elemento.getBounds(), {
      padding: [50, 50]
    });
  }

  clickLocateCirc(id:number){
    var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == id)[0];
    
    this.mapService.map.panTo(new L.LatLng(geo.geo_elemento._latlng.lat, geo.geo_elemento._latlng.lng));
  }

  clickLocateLin(id:number){
    const geo = this.polylineGeofenceService.polyline_geofences.filter((item:any)=> item.id == id)[0];

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

  clickShowCirc(id:number, comesFromInputSwitch?: boolean){

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

  clickShowLin(id:number, comesFromInputSwitch?: boolean){

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

  onClickEyeCirc(){
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

  onClickTagNamesEyeCirc(){
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

  onClickEyeLin(){
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

  onClickTagNamesEyeLin(){
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

  clickAgregarGeocerca() {
    this.geofencesService.nombreComponente = "AGREGAR";
    this.geofencesService.action         = "add";

  }

  clickConfigurarGeocerca(id:number) {
    //console.log('clickConfigurarGeocerca');
    //this.geofencesService.nombreComponente = "AGREGAR";
    //console.log(id);
    this.geofencesService.action         = "edit";
    this.geofencesService.idGeocercaEdit = id;
  }

  clickAgregarGeocercaCirc() {
    this.circularGeofencesService.nameComponentCirc = "AGREGAR";
    this.circularGeofencesService.action = "add";

  }

  clickConfigurarGeocercaCirc(id:number) {
    this.circularGeofencesService.nameComponentCirc = "AGREGAR";
    this.circularGeofencesService.action         = "edit";
    this.circularGeofencesService.idGeocercaEdit = id;
  }

  clickAgregarGeocercaLin() {
    this.polylineGeofenceService.nombreComponente = "AGREGAR";
    this.polylineGeofenceService.action = "add";

  }

  clickConfigurarGeocercaLin(id:number) {
    this.polylineGeofenceService.nombreComponente = "AGREGAR";
    this.polylineGeofenceService.action         = "edit";
    this.polylineGeofenceService.idGeocercaEdit = id;
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

  clickEliminarGeocercaCirc(id:number) {

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

  clickEliminarGeocercaLin(id:number) {

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
