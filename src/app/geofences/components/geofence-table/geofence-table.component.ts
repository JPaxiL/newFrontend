import { Component, ElementRef, OnInit, OnChanges, ViewChild, OnDestroy, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { GeofencesService } from '../../services/geofences.service';
import { CircularGeofencesService } from '../../services/circular-geofences.service';
import { PolylineGeogencesService } from '../../services/polyline-geogences.service';
import { PanelService } from '../../../panel/services/panel.service';
import Swal from 'sweetalert2';
import { TreeNode } from 'primeng-lts/api';
import { NgxSpinnerService } from 'ngx-spinner';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { MapServicesService } from '../../../map/services/map-services.service';
import * as L from 'leaflet';
import 'leaflet-draw';
import { forkJoin } from 'rxjs';
import { Geofences } from '../../models/geofences';
import { IGeofence, ITag } from '../../models/interfaces';
import moment from 'moment';
interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-geofence-table',
  templateUrl: './geofence-table.component.html',
  styleUrls: ['./geofence-table.component.scss']
})
export class GeofenceTableComponent implements OnInit {
  files!: TreeNode[];
  cols!: Column[];
  viewOptions = 'viewGroup';
  datosCargados: boolean = false;
  NomBusqueda: string = "";
  searchValueGeo: string = "";
  noResults: boolean = false;
  geofences: TreeNode[]=[];
  geofencesFilter: any;
  objGeofences= new Geofences();
  objGeofencesFilter: any ;
  loading: boolean=true;
  list1: any = [];
  list2: any = [];
  sortOrder: number=1;
  private dataEdit : any = {
    id : -1,
    name : "",
    type : ""
  };
  
  alreadyLoaded: boolean = false;
  @ViewChild('nameEdit',{ static:true}) nameEdit!: ElementRef;
  @ViewChild('tt') tt!:any;
  @Output() eventDisplayTags = new EventEmitter<boolean>();
  @Output() onDeleteItem: EventEmitter<any> = new EventEmitter();

  treeGeofences: any;
  public column: number = 6; //posible order
  constructor(
    public geofencesService: GeofencesService,
    public mapService: MapServicesService,
    public panelService: PanelService,
    private circularGeofencesService: CircularGeofencesService,
    private polylineGeofenceService: PolylineGeogencesService,
    private spinner: NgxSpinnerService,
    private configDropdown: NgbDropdownConfig,
  ) { }

  async ngOnInit(): Promise <void> {    
    if(!this.geofencesService.initializingGeofences || !this.geofencesService.initializingUserPrivleges || !this.circularGeofencesService.initializingCircularGeofences || !this.circularGeofencesService.initializingUserPrivleges){
      //this.geofencesService.spinner.show('loadingGeofencesSpinner');
    }
    // if(!this.polylineGeofenceService.initializingPolylineGeofences || !this.polylineGeofenceService.initializingUserPrivleges){
    //   this.geofencesService.spinner.show('loadingGeofencesSpinner');
    // }
    // if(!this.circularGeofencesService.initializingCircularGeofences || !this.circularGeofencesService.initializingUserPrivleges){
    //   // this.geofencesService.spinner.show('loadingGeofencesSpinner');
    // }
    
    if(this.geofencesService.initializingGeofences){
      this.objGeofences.setGeofences(this.geofencesService.geofences as IGeofence[], 'polig');
      await this.objGeofences.setTags(this.geofencesService.listTag as ITag[]);
    }else{
      this.geofencesService.dataCompleted.subscribe(async (data:IGeofence[])=>{
        this.objGeofences.setGeofences(data, 'polig');      
        await this.objGeofences.setTags(this.geofencesService.listTag as ITag[]);
      })
    }
    if(this.circularGeofencesService.initializingCircularGeofences){
      this.objGeofences.setGeofences(this.circularGeofencesService.circular_geofences as IGeofence[], 'circ');
    }else{
      this.circularGeofencesService.dataCompleted.subscribe((data:IGeofence[])=>{
        this.objGeofences.setGeofences(data, 'circ');
      })
    }
    // if(this.polylineGeofenceService.initializingPolylineGeofences){
    //   this.objGeofences.setGeofences(this.polylineGeofenceService.polyline_geofences as IGeofence[], 'lin');
    // }else{
    //   this.polylineGeofenceService.dataCompleted.subscribe((data:IGeofence[])=>{
    //     this.objGeofences.setGeofences(data, 'lin');
    //   })
    // }
    //this.objGeofences = this.addDataGeofence(this.objGeofences);
    this.geofences = await this.objGeofences.createTreeNode();
    this.geofencesFilter = this.geofences;
    this.objGeofencesFilter = this.objGeofences;
    this.geofencesService.listGeofences = this.objGeofences.geofences;
  }

  private async updateTable(){
    // if(!this.geofencesService.initializingGeofences || !this.geofencesService.initializingUserPrivleges || !this.circularGeofencesService.initializingCircularGeofences || !this.circularGeofencesService.initializingUserPrivleges){
    //   //this.geofencesService.spinner.show('loadingGeofencesSpinner');
    // }
    // if(!this.polylineGeofenceService.initializingPolylineGeofences || !this.polylineGeofenceService.initializingUserPrivleges){
    //   this.geofencesService.spinner.show('loadingGeofencesSpinner');
    // }
    // if(!this.circularGeofencesService.initializingCircularGeofences || !this.circularGeofencesService.initializingUserPrivleges){
    //   // this.geofencesService.spinner.show('loadingGeofencesSpinner');
    // }
    const newGeofences = await this.objGeofences.createTreeNode();
    this.geofences = newGeofences;
    this.geofencesFilter = this.geofences;
    this.objGeofencesFilter = this.objGeofences;
    this.geofencesService.listGeofences = this.objGeofences.geofences;
  }
  onBusqueda(gaaa?:any) {
    if(this.NomBusqueda == ''){
      this.geofencesService.tblDataGeoFiltered = this.geofencesService.getTableData();
      this.noResults = false;
    } else {
      this.geofencesService.tblDataGeoFiltered = this.geofencesService.getTableData().filter( (geocerca: any) => {
        return geocerca.trama.orden != null && geocerca.trama.orden.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').toUpperCase().includes(this.NomBusqueda.normalize('NFKD').replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ0-9 -_.@]+/g, '').toUpperCase());
      });
      this.noResults = this.geofencesService.tblDataGeoFiltered.length == 0;
    }
  }

  matchesSearch(rowData?: any): boolean {
    const searchFields = ['zone_name']; 
  
    return searchFields.some(field => {
      const cellValue = rowData[field].toString().toLowerCase();
      return cellValue.includes(this.searchValueGeo.toLowerCase());
    });
  }

  addDataGeofence(geofences: any){
    const items = geofences;
    for (const i in items){
      items[i] = this.formatGeofence(items[i]);
    }
    return items;
  }

  public formatGeofence(geofence: any): any{
    const today = moment();
    geofence = this.addSelect(geofence);
    return geofence;
  }

  private addSelect(geofence: any){
    geofence.follow = false;
    geofence.eye = true;
    geofence.tag = true;
    geofence.arrayPrueba = [];
    geofence.arrayPruebaParada = [];
    geofence.paradaDesde = false;
    geofence.eventos = {};

    return geofence;
  }
  params: any;
  agInit(params: any){
    this.params = params;
  }
  onClickTags(){
    // this.geofencesService.compTags = "ADD TAG";
    // this.geofencesService.actionTag = "addTag"
    this.eventDisplayTags.emit(true);
  }

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

  treeTableResizing(e: any) {
    const navbarHeight = Number(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height').replace('rem', ''));
    const rowBusquedaHeight = Number(getComputedStyle(document.documentElement).getPropertyValue('--row-busqueda-height').replace('rem', ''));
    const panelMonitoreogeofencesHeaderHeight = Number(getComputedStyle(document.documentElement).getPropertyValue('--pm-vehiculos-header-height').replace('rem', ''));
    const treetableHeaderHeight = Number(getComputedStyle(document.documentElement).getPropertyValue('--treetable-header-height').replace('rem', ''));
    const rem_to_px = parseFloat(getComputedStyle(document.documentElement).fontSize);
    var treeTable_height_in_px = $('.map-area-app').height()! - rem_to_px * (rowBusquedaHeight + panelMonitoreogeofencesHeaderHeight + treetableHeaderHeight + ($('.map-area-app').width()! > 740? 0: navbarHeight)) ;
    $('p-treetable.geofence-treetable .cdk-virtual-scroll-viewport').attr('style', 'height: ' + treeTable_height_in_px + 'px !important');
  }

  showGeoTags(){
    var geoList = this.geofencesService.geofences.map((geo: { id: number, zone_visible: string, tags: []})=>
    {
      return {id: geo.id, visible: geo.zone_visible, tag: geo.tags }
    });
    geoList.forEach((geo: {id: number, visible: string, tag: []}) => {
      if((geo.visible == 'true') != this.geofencesService.eyeInputSwitch){
        this.clickShowGeoPol(geo.id, true)
      }
    });
  }

  onClickEyeAll(){
      this.onClickEyePol();
      this.onClickEyeCir();
      //this.clickShowGeoLin();
  }
  onClickEyePol(){
    var geofencesList = this.geofencesService.geofences.map( (geofence: { id: number, zone_visible: string }) =>
      { return { id: geofence.id, visible: geofence.zone_visible}; } );
    geofencesList.forEach((geofence: { id: number, visible: string }) => {
      if((geofence.visible == 'true') != this.geofencesService.eyeInputSwitch){
        this.clickShowGeoPol(geofence.id, true);
      }
    });

    for(let i = 0; i < this.geofencesService.geofences.length; i++){
      this.geofencesService.clearDrawingsOfGeofence(this.geofencesService.geofences[i]);
    }
    for(let i = 0; i < this.geofencesService.geofences.length; i++){
      this.geofencesService.showDrawingsOfGeofence(this.geofencesService.geofences[i]);
    }
  }
  onClickEyeCir(){
    let ciruclarGeofencesList = this.circularGeofencesService.circular_geofences.map( (circular_geofence: { id: number, zone_visible: string }) => { 
      return { id: circular_geofence.id, visible: circular_geofence.zone_visible}; });

    ciruclarGeofencesList.forEach((circular_geofence: { id: number, visible: string }) => {
      if((circular_geofence.visible == 'true') != this.geofencesService.eyeInputSwitch){
        this.clickShowGeoCir(circular_geofence.id, true);
      }
    });

    for(let i = 0; i < this.circularGeofencesService.circular_geofences.length; i++){
      this.circularGeofencesService.clearDrawingsOfGeofence(this.circularGeofencesService.circular_geofences[i]);
    }
    for(let i = 0; i < this.circularGeofencesService.circular_geofences.length; i++){
      this.circularGeofencesService.showDrawingsOfGeofence(this.circularGeofencesService.circular_geofences[i]);
    }
  }

  onClickTagNamesEyeAll(){
    this.onClickTagNamesEyePol();
    this.onClickTagNamesEyeCir();
    this.onClickTagNamesEyeLin();
  }
  onClickTagNamesEyePol(){
    this.geofencesService.tagNamesEyeState = !this.geofencesService.tagNamesEyeState;
    var geofencesList = this.geofencesService.geofences.map( (geofence: { id: number, zone_name_visible: string }) =>
      { return { id: geofence.id, tag_visible: geofence.zone_name_visible}; } );
    geofencesList.forEach((geofence: { id: number, tag_visible: string }) => {
      if((geofence.tag_visible == 'true') != this.geofencesService.tagNamesEyeState){
        this.clickShowNameGeoPol(geofence.id, true);
      }
    });
  }
  onClickTagNamesEyeCir(){
    this.circularGeofencesService.tagNamesEyeState = !this.tagNamesEyeState;
    let circularGeofencesList = this.circularGeofencesService.circular_geofences.map( (circular_geofence: { id: number, zone_name_visible: string }) => { 
      return { 
        id: circular_geofence.id, 
        tag_visible: circular_geofence.zone_name_visible}; 
      });
      circularGeofencesList.forEach((circular_geofence: { id: number, tag_visible: string }) => {
      if((circular_geofence.tag_visible == 'true') != this.tagNamesEyeState){
        this.clickShowNameGeoCir(circular_geofence.id, true);
      }
    });
  }
  onClickTagNamesEyeLin(){
    this.polylineGeofenceService.tagNamesEyeState = !this.tagNamesEyeState;
    let polyGeofencesList = this.polylineGeofenceService.polyline_geofences.map( (circular_geofence: { id: number, zone_name_visible: string }) => { 
      return { 
        id: circular_geofence.id, 
        tag_visible: circular_geofence.zone_name_visible}; 
      });
      polyGeofencesList.forEach((circular_geofence: { id: number, tag_visible: string }) => {
      if((circular_geofence.tag_visible == 'true') != this.tagNamesEyeState){
        this.clickShowNameGeoLin(circular_geofence.id, true);
      }
    });
  }

  clickShowGeo(id: number, type: string){
    if(type=='polig'){
      this.clickShowGeoPol(id);
    }else if (type=='circ'){
      this.clickShowGeoCir(id);
    }else if(type == 'line'){
      this.clickShowGeoLin(id);
    }
  }

  clickShowGeoPol(id:number, comesFromInputSwitch?: boolean){
    //console.log("localizar una geocerca");
    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];
    //console.log(geo);

    if (geo.zone_visible == 'true') {
      geo.zone_visible  = 'false';
      this.mapService.map.removeLayer(geo.geo_elemento);
      if(geo.zone_name_visible == 'true'){
        this.clickShowNameGeoPol(id);
      }
    } else {
      geo.zone_visible  = 'true';
      geo.geo_elemento.addTo(this.mapService.map);
    }

    this.geofencesService.updateGeoCounters();
    this.geofencesService.updateGeoTagCounters();

    if(typeof comesFromInputSwitch == 'undefined' || !comesFromInputSwitch){
      let auxIndex = -1;
      this.geofencesService.eyeInputSwitch = this.geofencesService.geofenceCounters.visible != 0;

      if(geo.zone_visible == 'true'){
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

  clickShowGeoCir(id:number, comesFromInputSwitch?: boolean){
    let geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == id)[0];

    if (geo.zone_visible == 'true') {
      geo.zone_visible  = 'false';
      this.mapService.map.removeLayer(geo.geo_elemento);
      if(geo.zone_name_visible == 'true'){
        this.clickShowNameGeoCir(id);
      }
    } else {
      geo.zone_visible  = 'true';
      geo.geo_elemento.addTo(this.mapService.map);
    }

    this.circularGeofencesService.updateGeoCounters();
    this.circularGeofencesService.updateGeoTagCounters();

    if(typeof comesFromInputSwitch == 'undefined' || !comesFromInputSwitch){
      let auxIndex = -1;
      this.circularGeofencesService.eyeInputSwitch = this.circularGeofencesService.circularGeofenceCounters.visible != 0;

      if(geo.zone_visible == 'true'){

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

  clickShowGeoLin(id:number, comesFromInputSwitch?: boolean){

    let geo = this.polylineGeofenceService.polyline_geofences.filter((item:any)=> item.id == id)[0];

    if (geo.zone_visible == 'true') {

      geo.zone_visible  = 'false';
      this.mapService.map.removeLayer(geo.geo_elemento);

      if(geo.zone_name_visible == 'true'){
        this.clickShowNameGeoLin(id);
      }
    } else {
      geo.zone_visible  = 'true';
      geo.geo_elemento.addTo(this.mapService.map);
    }

    this.polylineGeofenceService.updateGeoCounters();
    this.polylineGeofenceService.updateGeoTagCounters();

    if(typeof comesFromInputSwitch == 'undefined' || !comesFromInputSwitch){
      let auxIndex = -1;
      
      this.polylineGeofenceService.eyeInputSwitch = (this.polylineGeofenceService.polylineGeofenceCounters.visible != 0);

      if(geo.zone_visible == 'true'){

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

  clickShowNameGeoAll(id: number, type: string){
    if(type=='polig'){
      this.clickShowNameGeoPol(id);
    }else if (type=='circ'){
      this.clickShowNameGeoCir(id);
    }else if(type == 'line'){
      this.clickShowNameGeoLin(id);
    }
  }

  clickShowNameGeoPol(id:number, comesFromInputSwitch?: boolean){
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

  clickShowNameGeoCir(id:number, comesFromInputSwitch?: boolean){
    var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == id)[0];

    if (geo.zone_name_visible == 'true') {
      geo.zone_name_visible  = 'false';
      geo.zone_name_visible_bol = false;
      this.mapService.map.removeLayer(geo.marker_name);
    } else {
      geo.zone_name_visible  = 'true';
      geo.zone_name_visible_bol = true;
      geo.marker_name.addTo(this.mapService.map);
    }
    this.circularGeofencesService.updateGeoTagCounters();
    if(typeof comesFromInputSwitch == 'undefined' || !comesFromInputSwitch){
      this.circularGeofencesService.tagNamesEyeState = (this.circularGeofencesService.circularGeofenceTagCounters.visible != 0);
    }
  }

  clickShowNameGeoLin(id:number, comesFromInputSwitch?: boolean){
    
    var geo = this.polylineGeofenceService.polyline_geofences.filter((item:any)=> item.id == id)[0];

    if (geo.zone_name_visible == 'true') {
      geo.zone_name_visible  = 'false';
      geo.zone_name_visible_bol = false;
      this.mapService.map.removeLayer(geo.marker_name);
    } else {
      geo.zone_name_visible  = 'true';
      geo.zone_name_visible_bol = true;
      geo.marker_name.addTo(this.mapService.map);
    }

    this.polylineGeofenceService.updateGeoTagCounters();
    if(typeof comesFromInputSwitch == 'undefined' || !comesFromInputSwitch){
      this.polylineGeofenceService.tagNamesEyeState = (this.polylineGeofenceService.polylineGeofenceTagCounters.visible != 0);
    }
  }

  clickLocate(id:number, type:string){
     if(type=='polig'){
      this.clickLocatePol(id);
    }else if (type=='circ'){
      this.clickLocateCir(id)
    }else if(type == 'line'){
      this. clickLocateLin(id);
    }
  }
  clickLocatePol(id: any){
    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];
    this.mapService.map.fitBounds(geo.geo_elemento.getBounds(), {
      padding: [50, 50]
    });
  }
  clickLocateCir(id:number){
    var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == id)[0];
    this.mapService.map.fitBounds(geo.geo_elemento.getBounds(), {
      padding: [50, 50]
    });
  }
  clickLocateLin(id:any){
    const geo = this.polylineGeofenceService.polyline_geofences.filter((item:any)=> item.id == id)[0];
    this.mapService.map.fitBounds(geo.geo_elemento.getBounds(), {
      padding: [50, 50]
    });
  }

  clickAgregarGeocercaPol() {
    this.geofencesService.nameComponentPol = "ADD GEOPOL";
    this.geofencesService.action         = "add";
  }

  clickConfigGeocerca(id:number, type:string){
    if(type=='polig'){
      this.clickConfigGeocercaPol(id);
    }else if (type=='circ'){
      this.clickConfigGeocercaCir(id);
    }else if(type == 'line'){
      //this.clickConfigurarGeocercaLin(id);
    }
  }

  clickConfigGeocercaPol(id:number) {
    this.geofencesService.nameComponentPol = "ADD GEOPOL";
    this.geofencesService.action         = "edit";
    this.geofencesService.idGeocercaEdit = id;
  }

  clickConfigGeocercaCir(id:number) {
    this.geofencesService.nameComponentPol = "ADD GEOPOL";
    this.geofencesService.action         = "edit";
    this.circularGeofencesService.idGeocercaEdit = id;
  }

  
  clickEliminarGeocerca(id:number , type: string){
    if(type=='polig'){
      this.clickEliminarGeocercaPol(id);
    }else if (type=='circ'){
      this.clickEliminarGeocercaCir(id);
    }else if(type == 'line'){
      //this.clickEliminarGeocercaLin(id);
    }
  }

  async clickEliminarGeocercaPol(id:number) {
    this.geofencesService.action = "delete";
    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];

    Swal.fire({
        title: '¿Está seguro?',
        text: `¿Está seguro que desea eliminar "${geo.zone_name}"?`,
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
          this.geofencesService.updateGeoCounters();
          this.geofencesService.updateGeoTagCounters();
          this.geofencesService.eyeInputSwitch = this.geofencesService.geofenceCounters.visible != 0;
          this.geofencesService.tagNamesEyeState = this.geofencesService.geofenceTagCounters.visible != 0;
          this.onBusqueda();
          //const aux = this.objGeofences.filter((item: { id: number; }) => item.id ==id);
        }
      }).then(async data => {
        if(data.isConfirmed){
        this.updateTable();
        //this.onDeleteItem.emit();
        Swal.fire(
          'Eliminado',
          'Los datos se eliminaron correctamente!!',
          'success'
        );
      }
    });
  }

  clickEliminarGeocercaCir(id:number) {
    this.circularGeofencesService.action = "delete";
    var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == id)[0];

    Swal.fire({
        title: '¿Está seguro?',
        text: `¿Está seguro que desea eliminar "${geo.zone_name}"?`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        preConfirm:async () => {
          const res = await this.circularGeofencesService.delete(id);
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
            this.circularGeofencesService.eyeInputSwitch = this.circularGeofencesService.circularGeofenceCounters.visible != 0;
            this.circularGeofencesService.tagNamesEyeState = this.circularGeofencesService.circularGeofenceTagCounters.visible != 0;
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

  async updateOperation(){
    const geofences = this.geofencesService.geofences;
    if(this.dataEdit.type=='operation'){
      for (const key in this.list1) {
        let index = geofences.indexOf(this.list1[key]);
        geofences[index].idgrupo = null;
        geofences[index].grupo = "geocercas Sin Operacion";
      }

      for (const key in this.list2){
        let index = geofences.indexOf(this.list2[key]);
        geofences[index].idgrupo = this.dataEdit.id;
        geofences[index].grupo = this.nameEdit.nativeElement.value;
      }
      for(const key in geofences){
        if(geofences[key].idgrupo==this.dataEdit.id){
          geofences[key].grupo=this.nameEdit.nativeElement.value
        }
      }
    }else{
      for (const key in this.list1) {
        let index = geofences.indexOf(this.list1[key]);
        geofences[index].idconvoy = null;
        geofences[index].convoy = "geocercas Sin Grupo";
      }

      for (const key in this.list2){
        let index = geofences.indexOf(this.list2[key]);
        geofences[index].idconvoy = this.dataEdit.id;
        geofences[index].convoy = this.nameEdit.nativeElement.value;
      }
      for(const key in geofences){
        if(geofences[key].idconvoy==this.dataEdit.id){
          geofences[key].convoy=this.nameEdit.nativeElement.value;
        }
      }
    }
    this.geofencesService.geofences = geofences;
    this.geofencesService.geofencesTree = await this.objGeofences.createTreeNode();
  }

  btnSelected: number = 1;

  tableView(btn: number): void {
    this.btnSelected = btn;
    if(btn==1){
      this.viewOptions='viewGroup';
    }else if(btn==2){
      this.viewOptions='viewGen';
    }
  }

  import(type:string){
    console.log("import from ",type);
  }

  export(type:string){
    console.log("export to ",type);
  }

}
