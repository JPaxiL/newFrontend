import { Component, ElementRef, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
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
import { IGeofence } from '../../models/interfaces';
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
  @Output() eventDisplayGroup = new EventEmitter<boolean>();
  datosCargados: boolean = false;
  NomBusqueda: string = "";
  noResults: boolean = false;

  geofences: TreeNode[]=[];
  objGeofences= new Geofences();
  loading: boolean=true;
  list1: any = [];
  list2: any = [];
  //cols: any[]=[];
  sortOrder: number=1;
  private dataEdit : any = {
    id : -1,
    name : "",
    type : ""
  };
  alreadyLoaded: boolean = false;

  @ViewChild('nameEdit',{ static:true}) nameEdit!: ElementRef;
  @ViewChild('tt') tt!:any;
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
  ) { 
    // if(this.loading){
    //   this.spinner.show('loadingTreTable');
    // } else {
    //   this.alreadyLoaded = true;
    //   console.log(this.alreadyLoaded);
    // }
    // configDropdown.placement = 'right-top';
    // configDropdown.autoClose = 'outside';
    // this.geofencesService.dataTreeCompleted.subscribe(geofences=>{
    //   this.geofences = this.geofencesService.geofencesTree;
    //   this.loading=false;
    //   this.spinner.hide('loadingTreeTable');
    //   this.treeTableResizing(true);
    //   this.headerScrollHandler();
    // });

    // this.geofencesService.reloadTableTree.subscribe(res=>{
    //   if(this.geofencesService.treeTableStatus){
    //     // //console.log('desde tree table ...');
    //     this.geofences = this.geofencesService.geofencesTree;
    //   }
    // });
  }

  ngOnInit(): void {    
    console.log("hello Geofences!!!")
    //this.geofencesService.getData().then((geofences) => (this.files = files));
        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'size', header: 'Size' },
            { field: 'type', header: 'Type' }
        ];
    if(!this.geofencesService.initializingGeofences || !this.geofencesService.initializingUserPrivleges){
      this.geofencesService.spinner.show('loadingGeofencesSpinner');
    }
    if(!this.polylineGeofenceService.initializingPolylineGeofences || !this.polylineGeofenceService.initializingUserPrivleges){
      this.polylineGeofenceService.spinner.show('loadingPolylineGeofencesSpiner');
    }
    if(!this.circularGeofencesService.initializingCircularGeofences || !this.circularGeofencesService.initializingUserPrivleges){
      this.circularGeofencesService.spinner.show('loadingCircularGeofencesSpiner');
    }
    
    forkJoin([
      this.geofencesService.dataCompleted,
      this.circularGeofencesService.dataCompleted,
      this.polylineGeofenceService.dataCompleted
    ]).subscribe((data: [IGeofence[], IGeofence[], IGeofence[]]) => {
      // data[0] contiene los datos de geofencesService
      // data[1] contiene los datos de circularGeofencesService
      // data[2] contiene los datos de polylineGeofenceService
      
      // Utiliza los datos como desees, por ejemplo, setea en tu objGeofences:
      const combinedData = [...data[0], ...data[1], ...data[2]];
      this.objGeofences.setGeofences(combinedData);
    });
    if(this.geofencesService.initializingGeofences){
      this.objGeofences.setGeofences(this.geofencesService.geofences as IGeofence[]);
    }else{
      this.geofencesService.dataCompleted.subscribe((data:IGeofence[])=>{
        this.objGeofences.setGeofences(data);      
      })
    }
    if(this.circularGeofencesService.initializingCircularGeofences){
      this.objGeofences.setGeofences(this.circularGeofencesService.circular_geofences as IGeofence[]);
    }else{
      this.circularGeofencesService.dataCompleted.subscribe((data:IGeofence[])=>{
        this.objGeofences.setGeofences(data);
      })
    }
    if(this.polylineGeofenceService.initializingPolylineGeofences){
      this.objGeofences.setGeofences(this.polylineGeofenceService.polyline_geofences as IGeofence[]);
    }else{
      this.polylineGeofenceService.dataCompleted.subscribe((data:IGeofence[])=>{
        this.objGeofences.setGeofences(data);
      })
    }
    console.log("AllGeoooo", this.objGeofences.getGeofences())
    this.treeGeofences = this.objGeofences.createTreeNode();
  }

  onBusqueda(gaaa?:any) {
    console.log(gaaa);
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

  clickLocate(id:number){
    //console.log("localizar una geocerca");
    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];
    //console.log(geo);

    this.mapService.map.fitBounds(geo.geo_elemento.getBounds(), {
      padding: [50, 50]
    });
  }

  onSort(data: any){
    // //console.log("sort desde tree", data);
    this.sortOrder=data;
  }

  onClickFollow(rowData: any){
    rowData.follow = !rowData.follow;
    //this.followService.add(rowData);
  }

  clickAgregarGeocerca() {
    this.geofencesService.nombreComponente = "AGREGAR";
    this.geofencesService.action         = "add";
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

  updateOperation(){
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
    this.geofencesService.geofencesTree = this.objGeofences.createTreeNode();
  }

}
