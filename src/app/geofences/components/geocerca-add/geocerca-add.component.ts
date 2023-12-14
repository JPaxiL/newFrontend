import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { PanelService } from '../../../panel/services/panel.service';
import Swal from 'sweetalert2';
import { GeofencesService } from '../../services/geofences.service';
import { MapServicesService } from '../../../map/services/map-services.service';
import  { VehicleService } from '../../../vehicles/services/vehicle.service';
import * as L from 'leaflet';
import 'leaflet-editable';
import 'leaflet-path-drag';
import 'leaflet-measure-path'
import 'leaflet-measure-path/leaflet-measure-path.css';
import { NgxSpinnerService } from 'ngx-spinner';
import { CircularGeofencesService } from '../../services/circular-geofences.service';
import { PolylineGeogencesService } from '../../services/polyline-geogences.service';
import { id } from '@swimlane/ngx-charts';
import { Geofences } from '../../models/geofences';

declare var $: any;
@Component({
  selector: 'app-geocerca-add',
  templateUrl: './geocerca-add.component.html',
  styleUrls: ['./geocerca-add.component.scss']
})

export class GeocercaAddComponent implements OnInit, OnDestroy  {
  form :any = {};
  btnSelected: number = 1;
  poligonAddCir!: L.Circle;
  nameComponentCir= "ADD GEOCIR";
  operations : any = [];
  groups : any = [];
  tags : any = [];
  selectedGroup: any={};
  selectedOperation: any={};
  selectedTag: any=[];
  disabledOperation = false;
	disabledGroup = true;
  geoOptions = 'poligon';
  action:string = "add";
  poligonAdd:any;
  placeholderOperation = 'Seleccione una Operación ...';
  placeholderGroup = 'Seleccione una Operación Primero...';
  listOptions: any= [
    { idOption: 'Operación', valueOption: 'operacion' },
    { idOption: 'Grupo', valueOption: 'grupo' },  
  ];
  
  listOptionCheckbox = 'operacion';
  booleanOptions = [
    { label: 'Sí', value: true },
    { label: 'No', value: false },
  ];

  tempTag = [
    { var_name: 'prueba', id: 1},
    { var_name: 'prueba2', id: 2},
    { var_name: 'prueba3', id: 3},
  ]

  fontSizeOptions = [
    { label: '8px', value: 8 },
    { label: '9px', value: 9 },
    { label: '10px', value: 10 },
    { label: '11px', value: 11 },
    { label: '12px', value: 12 },
    { label: '13px', value: 13 },
    { label: '14px', value: 14 },
    { label: '15px', value: 15 },
    { label: '16px', value: 16 },
    { label: '17px', value: 17 },
    { label: '18px', value: 18 },
    { label: '19px', value: 19 },
    { label: '20px', value: 20 },
  ]

  filterTag: string = '';
  constructor(
    public geofencesService: GeofencesService,
    public mapService: MapServicesService,
    private spinner: NgxSpinnerService,
    public vehicleService: VehicleService,
    public circularGeofencesService: CircularGeofencesService,
  ) { }
  
  measurementUnits = [
    {id: 'm', factor: 1},
    {id: 'km', factor: 0.001}
  ];

  availableOptionsCategoria = [
    {id: '0', name: 'No Asignado'},
    {id: '1', name: 'Pasajeros'},
    {id: '2', name: 'Concentrado'}
  ];

  ngOnInit(): void {
    if ( this.geofencesService.nameComponentPol = "ADD GEOPOL") {
      if(this.geofencesService.action=='edit'){
        //desabilitar elbotton circular
        this.llenar_formulario();
      var geo = this.geofencesService.geofences.filter((item:any)=> item.id == this.geofencesService.idGeocercaEdit)[0];
      //console.log(geo);
      if (geo.zone_visible == 'true') {
        //Si la geocerca era visible previamente, entonce remover la capa para eliminar  //los eventos mouseover y mouseout
        console.log('Eliminando geocerca porque era visible');
        this.mapService.map.removeLayer(geo.geo_elemento);
      }
      //Se crea un nuevo poligono para eliminar la referencia previa de geo_elemento, eliminando asi //tambien los eventos vinculados (mouseover y mouseout)
      geo.geo_elemento = new L.Polygon( this.getCoordenadas( JSON.parse(geo.geo_coordenadas).coordinates[0] ), {
        weight: 3,
        fill: true,
        color: geo.zone_color,
      });
      geo.geo_elemento.addTo(this.mapService.map);
      geo.geo_elemento.editing.enable();
      this.optionsOperationsGroups();
      } else {
      this.nuevo_formulario();
      this.optionsOperationsGroups();
      this.poligonAdd = this.mapService.map.editTools.startPolygon();
      this.changeGeoColor(this.form.id);
      this.poligonAdd.editing.enable();
      }
    }else {
      if (this.circularGeofencesService.action == "edit"){
        this.llenar_formularioCir()
        var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == this.circularGeofencesService.idGeocercaEdit)[0];
  
        if (geo.zone_visible == 'true') {
          this.mapService.map.removeLayer(geo.geo_elemento);
        }
        geo.geo_elemento = new L.Circle( this.circularGeofencesService.getCoordenadas(geo.geo_coordenadas), {
          radius: this.circularGeofencesService.getRadius(geo.geo_coordenadas),
          weight: 3,
          fill: geo.zone_no_int_color,
          color: geo.zone_color,
        });
        this.poligonAddCir = geo.geo_elemento.addTo(this.mapService.map);
        this.poligonAddCir.enableEdit();
        this.optionsOperationsGroups();

      }else{
        this.nuevo_formularioCir();
        this.poligonAddCir = this.mapService.map.editTools.startCircle();
        this.changeGeoColorCir(this.form.id);
        this.optionsOperationsGroups();
      }
      this.poligonAddCir.on('editable:editing', (event) => {
        let radio = (event.layer.getRadius()/1000).toFixed(2);
        this.form.radio = radio;
        this.form.area = this.getCircleArea(radio).toFixed(2);
      }) 
    }
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.mapService.map.editTools.stopDrawing();
  }

  optionsOperationsGroups(){
    let aux: any [] = [];
      aux = this.vehicleService.vehicles;
      //console.log("lista de vehivulossssssss", aux);
      for (const vehicle of aux) {
        const id_operation = vehicle.idoperation;
        // const id_grupo = vehicle.idgrupo;
        const filteredOperation = {
          idoperation: vehicle.idoperation,
          nameoperation: vehicle.nameoperation,
        };
  if (!this.operations.some((op:any) => op.idoperation === id_operation)) {
          this.operations.push(filteredOperation);
        }
  }
      this.operations.sort((a: { idoperation: number; }, b: { idoperation: number; }) => a.idoperation - b.idoperation);
          console.log('Operations: ',this.operations);
  }
  optionsTags(){
    let aux:  any [] = [];
    //aux = this.g;
  }
  onSelecTags(){
    console.log('etiquetasSelect',this.selectedTag);
    this.form.tags = this.selectedTag;
    this.form.tags = this.form.tags.join(',');
  }
  deleteTag(){
    
  }

  selectBtn(btn: number): void {
    this.btnSelected = btn;
    if(btn==1){
      if(this.poligonAddCir){
        this.mapService.map.removeLayer(this.poligonAddCir);
      }
      this.geoOptions = 'poligon';
      this.nuevo_formulario();
      this.poligonAdd = this.mapService.map.editTools.startPolygon();

      this.changeGeoColor(this.form.id);

      this.poligonAdd.editing.enable();
    }else if(btn==2){
      if(this.poligonAdd){
        this.mapService.map.removeLayer(this.poligonAdd);
      }
      this.geoOptions = 'circ';
      this.nuevo_formularioCir();
      this.poligonAddCir = this.mapService.map.editTools.startCircle();
      this.changeGeoColorCir(this.form.id);
    }else if(btn==3){
      this.geoOptions = 'line';
      if(this.poligonAdd){
        this.mapService.map.removeLayer(this.poligonAdd);
      }
      if(this.poligonAddCir){
        this.mapService.map.removeLayer(this.poligonAddCir);
      }
    }
  }

  clickFormGeoPol(){
    // this.geoOptions = 'poligon';
  }
  clickFormGeoCir(){
    // this.geoOptions = 'circ';
  }
  clickFormGeoLin(){
    // this.geoOptions = 'line';
  }

  clickAgregarGeocercaPol() {
    this.geofencesService.nameComponentPol = "ADD GEOPOL";
    this.geofencesService.action         = "add";    
  }

  clickAgregarGeocercaCir() {
    this.circularGeofencesService.nameComponentCir = "ADD GEOCIR";
    this.circularGeofencesService.action = "add";
  }
  onOptionSelected(){
    let option = this.listOptionCheckbox;
    if(option=='grupo'){
      this.selectedGroup = {};
      this.disabledGroup = true;
      this.placeholderGroup = 'Seleccione una operacion primero...';
    }else if(option=='operacion'){
      this.selectedOperation = {};
      this.selectedGroup = {};
      this.disabledOperation = false;
      this.placeholderOperation = 'Seleccione una operacion...';
    }else{
      this.selectedOperation = {};
      this.selectedGroup = {};
    }
    this.selectedOperation = {};
    this.selectedGroup = {};
    this.form.id_operation = '';
    this.form.id_grupo = '';
  }

  onChangeOperation(){
    let aux2: any[]=[];
    console.log(this.selectedOperation);
    aux2 = this.vehicleService.vehicles.filter((vehicle: any)=>vehicle.idoperation == this.selectedOperation);

      for (const vehicle of aux2) {
        const idgroup = vehicle.idgrupo;
        const filteredGroup = {
          idgrupo: vehicle.idgrupo,
          namegrupo: vehicle.namegrupo
        };
        if (!this.groups.some((v: { idgrupo: any; }) => v.idgrupo === idgroup)) {
          this.groups.push(filteredGroup);
        }
      }
      this.groups.sort((a: { idgrupo: number; }, b: { idgrupo: number; }) => a.idgrupo - b.idgrupo);
      if(this.listOptionCheckbox == 'grupo'){
        this.selectedGroup = {};
        this.disabledGroup = false;
        this.placeholderGroup = 'Seleccione un grupo...';
      }
      this.form.id_operation = this.selectedOperation;
      // console.log('auxliar2 POST:',this.groups);
  }
  
  getNameOperation(idOpe: any){
    if(!idOpe){
      return 'Geocercas Sin Operacion';
    }else {
      const foundVehicle = this.vehicleService.vehicles.find((vehicle) => vehicle.idoperation == idOpe);
      if (foundVehicle) {
        if(foundVehicle.nameoperation=='Unidades Sin Operacion'){
          return 'Geocercas Sin Operacion';
        } else {
          return foundVehicle.nameoperation;
        }
          // Usa nameOperation aquí según sea necesario
      } else {
        return 'Geocercas Sin Operacion';
      }
            // aux = this.vehicleService.vehicles.find{{}}
    }
  }
  getNameGrupo(idGrupo: any){
    if(!idGrupo){
      return 'Geocercas Sin Grupo';
    }else {
      const foundVehicle = this.vehicleService.vehicles.find((vehicle) => vehicle.idgrupo == idGrupo);
      if (foundVehicle) {
        if(foundVehicle.namegrupo=='Unidades Sin Grupo'){
          return 'Geocercas Sin Grupo';
        } else {
          return foundVehicle.namegrupo;
        }
          // Usa nameOperation aquí según sea necesario
      } else {
        return 'Geocercas Sin Grupo';
      }
            // aux = this.vehicleService.vehicles.find{{}}
    }
  }

  onChangeGrupo(){
    this.form.id_grupo = this.selectedGroup;
  }

  getLatLngCenter(latLngInDegr:any) {
    var LATIDX = 0;
    var LNGIDX = 1;
    var sumX = 0;
    var sumY = 0;
    var sumZ = 0;

    for (var i=0; i<latLngInDegr.length; i++) {
        var lat = this.degr2rad(latLngInDegr[i][LATIDX]);
        var lng = this.degr2rad(latLngInDegr[i][LNGIDX]);
        // sum of cartesian coordinates
        sumX += Math.cos(lat) * Math.cos(lng);
        sumY += Math.cos(lat) * Math.sin(lng);
        sumZ += Math.sin(lat);
    }

    var avgX = sumX / latLngInDegr.length;
    var avgY = sumY / latLngInDegr.length;
    var avgZ = sumZ / latLngInDegr.length;

    // convert average x, y, z coordinate to latitude and longtitude
    var lng = Math.atan2(avgY, avgX);
    var hyp = Math.sqrt(avgX * avgX + avgY * avgY);
    var lat = Math.atan2(avgZ, hyp);

    return ([this.rad2degr(lat), this.rad2degr(lng)]);
  }

  rad2degr(rad:any) { return rad * 180 / Math.PI; }
  degr2rad(degr:any) { return degr * Math.PI / 180; }

  ngOnDestroy(){

    if(this.btnSelected ==1){
      this.mapService.map.editTools.stopDrawing();

      //console.log('SALDRE DE LA EDICION DE GEOCERCA');
      if ( this.geofencesService.action == "edit" ) {

        //var geo = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];
        var geo = this.geofencesService.geofences.filter((item:any)=> item.id == this.geofencesService.idGeocercaEdit)[0];

        if ( this.geofencesService.action == "edit" ) {

            this.mapService.map.removeLayer(geo.geo_elemento);
            geo.geo_elemento = new L.Polygon( this.getCoordenadas( JSON.parse(geo.geo_coordenadas).coordinates[0] ), {
              weight: 3,
              fill: true,
              color: geo.zone_color //'#000000'
            });//.addTo(this.mapService.map);

            this.geofencesService.bindMouseEvents(geo);

            if (geo.zone_visible == 'true') {
              geo.geo_elemento.addTo(this.mapService.map);
            }
        }

      } else {
        this.mapService.map.removeLayer(this.poligonAdd);
      }

      for(let i = 0; i < this.geofencesService.geofences.length; i++){
        this.geofencesService.clearDrawingsOfGeofence(this.geofencesService.geofences[i]);
      }
      this.geofencesService.sortGeofencesBySize();
      for(let i = 0; i < this.geofencesService.geofences.length; i++){
        this.geofencesService.showDrawingsOfGeofence(this.geofencesService.geofences[i]);
      }
    } else if(this.btnSelected == 2){
        //Circular
      this.poligonAddCir.off();
      this.mapService.map.editTools.stopDrawing();

      if ( this.action == "edit" ) {

        var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == this.circularGeofencesService.idGeocercaEdit)[0];
            this.mapService.map.removeLayer(geo.geo_elemento);
            geo.geo_elemento = new L.Circle( this.circularGeofencesService.getCoordenadas(geo.geo_coordenadas), {
              radius: this.circularGeofencesService.getRadius(geo.geo_coordenadas),
              weight: 3,
              fill: geo.zone_no_int_color,
              color: geo.zone_color,
            });

            this.circularGeofencesService.bindMouseEvents(geo);

            if (geo.zone_visible == 'true') {
              geo.geo_elemento.addTo(this.mapService.map);
            }

      } else {
        this.mapService.map.removeLayer(this.poligonAddCir);
      }

      for(let i = 0; i < this.circularGeofencesService.circular_geofences.length; i++){
        this.circularGeofencesService.clearDrawingsOfGeofence(this.circularGeofencesService.circular_geofences[i]);
      }
      // this.circularGeofencesService.sortGeofencesBySize();
      for(let i = 0; i < this.circularGeofencesService.circular_geofences.length; i++){
        this.circularGeofencesService.showDrawingsOfGeofence(this.circularGeofencesService.circular_geofences[i]);
      }
    }
    
  }

  layerToPoints(figure:any, type:string) {
    var geoElement = '';

    switch (type) {
      case 'POLYGON':
        // var latlngs = figure.getLatLngs();
        var latlngs = figure.getLatLngs()[0];
        for (var i = 0, total = latlngs.length; i < total; i++) {
          geoElement += ` ${latlngs[i].lng} ${latlngs[i].lat}`;
          if (i < total-1) {
            geoElement += ',';
          }else {
            geoElement += `,${latlngs[0].lng} ${latlngs[0].lat}`;
          }
        }
        geoElement = `(${geoElement})`;
        break;
    }
    return geoElement;
   }

  fin_editar() {

    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == this.geofencesService.idGeocercaEdit)[0];

    geo.geo_elemento.editing.disable();

    //console.log('<<<<<latlngs');
    var geoElement = this.layerToPoints(geo.geo_elemento,'POLYGON');
    //console.log("============================ XXXX");
    //console.log(geoElement);
  }

  llenar_formulario(){
    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == this.geofencesService.idGeocercaEdit)[0];
    //console.log(geo);
    this.mapService.map.fitBounds(geo.geo_elemento.getBounds());
    //geo.geo_elemento.editing.enable();
            // updatePerimeterAndArea(vm.polygon.getLatLngs());
    // //console.log( "factorArea = "+factorArea );
    // //console.log( geo.geo_elemento.getLatLngs() );

    this.form.id = geo.id;
    this.form.nombre = geo.zone_name;
    this.form.descripcion = geo.descripcion;

    if (geo.geo_elemento) {
      let perimetro = this.getPerimeter(geo.geo_elemento.getLatLngs()[0]) * this.measurementUnits[1].factor;
      this.form.perimetro = perimetro.toFixed(2);

      var factorArea = Math.pow(this.measurementUnits[1].factor, 2); //km2
      let area = this.geodesicArea(geo.geo_elemento.getLatLngs()[0]) * factorArea;
      this.form.area = area.toFixed(2);

    } else {
      this.form.perimetro = 0;
      this.form.area = 0;
    }

    this.form.zone_type = 'POLYGON';
    this.form.color = geo.zone_color;//"#FFEE00";
    this.form.categoria = geo.zone_cat;
    let checkVelocidad = false;
    switch (geo.vel_act_zona) {
      case "0      ":
      case "false  ":
        checkVelocidad = false;
        break;
      case "1      ":
      case "true   ":
        checkVelocidad = true;
        break;
      default:
        checkVelocidad = false;
        break;
    }
    this.form.checkVelocidad = checkVelocidad;

    this.form.limite_velocidad = geo.vel_max;
    this.form.limite_tolerable = geo.vel_zona;
    this.form.limite_grave = geo.vel2_zona;
    this.form.limite_muy_grave = geo.vel3_zona;

    this.form.visible_zona         = geo.zone_visible;
    this.form.nombre_visible_zona  = geo.zone_name_visible;
    this.form.geo_geometry          = geo.zone_vertices;

    this.form.tag_name_color = /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(geo.tag_name_color)? geo.tag_name_color : this.geofencesService.defaultTagNameColor;
    this.form.tag_name_font_size = this.geofencesService.defaultTagNameFontSize; //px
    for(let i = 0; i< this.fontSizeOptions.length; i++){
      if(this.fontSizeOptions[i].value == geo.tag_name_font_size){
        this.form.tag_name_font_size = geo.tag_name_font_size;
      }
    }
    // if(!L.GeometryUtil){
    //   import('leaflet-geometryutil')
    //      .then( GeometryUtil => {
    //         //console.log('all good')
    //      })
    //      .catch( err => {throw(err)} )
    // }
    // //console.log(this.geodesicArea(geo.geo_elemento.getLatLngs()[0]));
    // //console.log(this.geodesicArea(geo.geo_elemento.getLatLngs()[0]) * factorArea);
    // //console.log(this.getPerimeter(geo.geo_elemento.getLatLngs()[0]));
  }

  llenar_formularioCir(){
    var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == this.circularGeofencesService.idGeocercaEdit)[0];
    this.mapService.map.panTo(new L.LatLng(geo.geo_elemento._latlng.lat, geo.geo_elemento._latlng.lng));

    this.form.id = geo.id;
    this.form.nombre = geo.zone_name;
    this.form.descripcion = geo.zone_descripcion;

    if (geo.geo_elemento) {
      let radio = (geo.geo_elemento.getRadius()/1000).toFixed(2);
      this.form.radio = radio;
      this.form.area = this.getCircleArea(radio).toFixed(2);
    } else {
      this.form.perimetro = 0;
      this.form.area = 0;
    }

    this.form.color = geo.zone_color;
    this.form.categoria = geo.zone_cat;
    let checkVelocidad = false;
    switch (geo.vel_act_zona) {
      case "0":
      case "false":
      case false:
        checkVelocidad = false;
        break;
      case "1":
      case "true":
      case true:
        checkVelocidad = true;
        break;
      default:
        checkVelocidad = false;
        break;
    }
    this.form.checkVelocidad = checkVelocidad;

    this.form.limite_velocidad = geo.int_limite_velocidad_0;
    this.form.limite_tolerable = geo.int_limite_velocidad_1;
    this.form.limite_grave = geo.int_limite_velocidad_2;
    this.form.limite_muy_grave = geo.int_limite_velocidad_3;

    this.form.visible_zona         = geo.zone_visible;
    this.form.nombre_visible_zona  = geo.zone_name_visible;
    this.form.geo_geometry          = geo.geo_coordenadas;

    // this.form.fill = geo.fill;
    this.form.zone_no_int_color = geo.zone_no_int_color;

    this.form.tag_name_color = /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(geo.tag_name_color)? geo.tag_name_color : this.circularGeofencesService.defaultTagNameColor;
    this.form.tag_name_font_size = this.circularGeofencesService.defaultTagNameFontSize; //px
    for(let i = 0; i< this.fontSizeOptions.length; i++){
      if(this.fontSizeOptions[i].value == parseInt(geo.tag_name_font_size)){
        this.form.tag_name_font_size = parseInt(geo.tag_name_font_size);
      }
    }
  }

  nuevo_formulario(){
    this.form.id = 0;
    this.form.nombre = '';
    this.form.descripcion = '';
    let perimetro = 0;
    this.form.perimetro = perimetro.toFixed(2);
    var factorArea = Math.pow(this.measurementUnits[1].factor, 2); //km2
    let area = 0;
    this.form.area = area.toFixed(2);
    this.form.color = "#ff0000";
    this.form.categoria = 0;

    this.form.checkVelocidad = false;

    this.form.zone_type = 'POLYGON';

    this.form.tag_name_color = this.geofencesService.defaultTagNameColor;
    this.form.tag_name_font_size = this.geofencesService.defaultTagNameFontSize; //px

    this.form.limite_velocidad = 0;
    this.form.limite_tolerable = 0;
    this.form.limite_grave = 0;
    this.form.limite_muy_grave = 0;

    this.form.visible_zona         = "true";
    this.form.nombre_visible_zona  = "true";

    this.form.geo_geometry          = "( -71.5331196784973 -16.40000880639486, -71.53320550918579 -16.400255801861498, -71.53292655944824 -16.400358724922672, -71.53284072875977 -16.40011170948444,-71.5331196784973 -16.40000880639486)";
  }

  nuevo_formularioCir(){
    this.form.id = 0;
    this.form.nombre = '';
    this.form.descripcion = '';

    let radio = 0;
    this.form.radio = radio.toFixed(2);

    var factorArea = Math.pow(this.measurementUnits[1].factor, 2); //km2
    let area = 0;
    this.form.area = area.toFixed(2);

    this.form.color = "#ff0000";
    this.form.categoria = 0;

    this.form.checkVelocidad = false;

    this.form.tag_name_color = this.circularGeofencesService.defaultTagNameColor;
    this.form.tag_name_font_size = this.circularGeofencesService.defaultTagNameFontSize; //px

    this.form.limite_velocidad = 0;
    this.form.limite_tolerable = 0;
    this.form.limite_grave = 0;
    this.form.limite_muy_grave = 0;

    this.form.visible_zona = "true";
    this.form.nombre_visible_zona = "true";

    this.form.geo_geometry = "<(-2.98692739333486,-69.43359375),671103.240326455>";
   
    this.form.zone_no_int_color = true;
  }

  geodesicArea (latLngs:any) {
    var pointsCount = latLngs.length,
      area = 0.0,
      d2r = Math.PI / 180,
      p1, p2;

    if (pointsCount > 2) {
      for (var i = 0; i < pointsCount; i++) {
        p1 = latLngs[i];
        p2 = latLngs[(i + 1) % pointsCount];
        area += ((p2.lng - p1.lng) * d2r) *
          (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
      }
      area = area * 6378137.0 * 6378137.0 / 2.0;
    }

    return Math.abs(area);
  };

  getPerimeter(latLngs:any) {
    if (latLngs.length > 0) {
      var perimeter = 0;

      if (latLngs[0] instanceof Array) {
        latLngs.forEach((latLng:any) => {
          perimeter += this.getPerimeter(latLng);
        });
      } else {
        for (var i = 1; i < latLngs.length; i++) {
          perimeter += latLngs[i].distanceTo(latLngs[i - 1]);
        }
      }
      return perimeter;
    }
    return 0;
  }

  clickCancelPol(id:number){
    //console.log("---clickCancelar");
    console.log("---1");
    this.mapService.map.editTools.stopDrawing();
    console.log("---2");
    this.geofencesService.nameComponentPol = "LISTAR";
    console.log("---3");
    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];
    if ( this.geofencesService.action == "edit" ) {

        this.mapService.map.removeLayer(geo.geo_elemento);
        geo.geo_elemento = new L.Polygon( this.getCoordenadas( JSON.parse(geo.geo_coordenadas).coordinates[0] ), {
          weight: 3,
          fill: true,
          color: geo.zone_color //'#000000'
        });//.addTo(this.mapService.map);
        this.geofencesService.bindMouseEvents(geo);

        if (geo.zone_visible == 'true') {
          geo.geo_elemento.addTo(this.mapService.map);
        }
    } else {
      console.log("---4");
      //console.log("CREACION DE GEOCERCA");
      this.mapService.map.removeLayer(this.poligonAdd);
    }

    //geo.geo_elemento.setLatLngs( this.getCoordenadas( JSON.parse(geo.geo_coordenadas).coordinates[0] ));
  }
  clickCancelCir(id:number){
    //this.mapService.map.editTools.stopDrawing();

    this.geofencesService.nameComponentPol = "LISTAR";

    var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == id)[0];
    if ( this.circularGeofencesService.action == "edit" ) {

      this.mapService.map.removeLayer(geo.geo_elemento);
      geo.geo_elemento = new L.Circle( this.circularGeofencesService.getCoordenadas(geo.geo_coordenadas), {
        radius: this.circularGeofencesService.getRadius(geo.geo_coordenadas),
        weight: 3,
        fill: geo.zone_no_int_color,
        color: geo.zone_color,
      });

      this.circularGeofencesService.bindMouseEvents(geo);

      if (geo.zone_visible == 'true') {
        geo.geo_elemento.addTo(this.mapService.map);
      }
    } else {
      this.mapService.map.removeLayer(this.poligonAddCir);
    }

  }

  createGeometryString(figure: L.Circle){

    //"<(-2.98692739333486,-69.43359375),671103.240326455>"
    //"<(-7.466705320402595,-76.33300781250001),189685.38698446512>"
    return `<(${figure.getLatLng().lat},${figure.getLatLng().lng}),${figure.getRadius()}>`

  }

  clickSavePol(id:number){
    if(this.form.nombre == null  || this.form.nombre.trim() == '' || this.form.nombre.trim().length == 0){
      Swal.fire({
        title: 'Error',
        text: 'El nombre de la geocerca no puede quedar vacío.',
        icon: 'warning',
      });
      return;
    }
    console.log(this.form.id_operation, this.form.id_grupo);
    if(this.listOptionCheckbox == 'operacion'){
      if(this.form.id_operation == null){
        Swal.fire({
          title: 'Error',
          text: 'Debe selccionar una operación.',
          icon: 'warning',
        });
        return;
      }
    }
    if (this.listOptionCheckbox == 'grupo'){
      if(this.form.id_operation == null && this.form.id_grupo == null){
        Swal.fire({
          title: 'Error',
          text: 'Debe selccionar una operación y un grupo.',
          icon: 'warning',
        });
        return;
      }
    }

    //console.log("---clickGuardar");
    this.spinner.show('spinnerLoading');

    if ( this.geofencesService.action == "edit" ) {

      var geo0 = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];
      this.form.geo_geometry = this.layerToPoints(geo0.geo_elemento,'POLYGON');

      geo0.geo_elemento.editing.disable();
      console.log(this.form);
      this.geofencesService.edit(this.form).then( (res1) => {
        //console.log("---clickGuardar----");
        console.log("revisarrrrr",res1);
        if(res1[1] != "Registro modificado"){
          console.log("mostrar Swalllll");
          Swal.fire(
            'Error',
            'No se pudo modificar!!',
            'error'
          );
          this.spinner.hide('spinnerLoading');
          return;
        }
        this.geofencesService.nameComponentPol =  "LISTAR";
        let gEdit = res1[2];
        let gEdit2 = res1[3][0];

        var geo = this.geofencesService.geofences.filter((item:any)=> item.id == gEdit.id)[0];

        // geo.merge(res1[2]);
        // geo = Object.assign(geo, res1[2]);
        geo.descripcion = gEdit.descripcion;
        geo.orden = gEdit.nombre_zona;
        geo.vel2_zona = gEdit.vel2_zona;
        geo.vel3_zona = gEdit.vel3_zona;
        geo.vel_act_zona = gEdit.vel_act_zona;
        geo.vel_max = gEdit.vel_max;
        geo.vel_zona = gEdit.vel_zona;
        geo.zone_cat = gEdit.categoria_zona;
        geo.zone_color = gEdit.color_zona;
        geo.zone_name = gEdit.nombre_zona;
        geo.zone_name_visible = gEdit.nombre_visible_zona;
        geo.zone_name_visible_bol = (geo.zone_name_visible == 'true');
        geo.zone_visible = gEdit.visible_zona;
        geo.tag_name_color = gEdit.tag_name_color;
        geo.tag_name_font_size = gEdit.tag_name_font_size;

        geo.geo_coordenadas = gEdit2.geo_coordenadas;
        geo.idgrupo = gEdit.grupo_convoy_id ?? '0';
        geo.idoperation = gEdit.operation_grupo_id ?? '0';
        geo.nameoperation = this.getNameOperation(geo.idoperation);
        geo.namegrupo = this.getNameGrupo(geo.idgrupo);

        this.mapService.map.removeLayer(geo.geo_elemento);
        this.mapService.map.removeLayer(geo.marker_name);

        geo.geo_elemento = new L.Polygon( this.getCoordenadas( JSON.parse(gEdit2.geo_coordenadas).coordinates[0] ), {
          weight: 3,
          fill: true,
          color: geo.zone_color //'#000000'
        });//.addTo(this.mapService.map);

        this.geofencesService.bindMouseEvents(geo);

        if (geo.zone_visible == 'true') {
          geo.geo_elemento.addTo(this.mapService.map);
        }

        //================= nombre de la geocerca
        var centerPoligon = geo.geo_elemento.getBounds().getCenter();

        let bg_color = this.geofencesService.tooltipBackgroundTransparent? this.geofencesService.defaultTagNameBackground: this.mapService.hexToRGBA(geo.zone_color);
        let txt_color = this.geofencesService.tooltipBackgroundTransparent? (geo.tag_name_color == ''? this.geofencesService.defaultTagNameColor: geo.tag_name_color): this.mapService.hexToRGBA(geo.zone_color);
        let font_size = (geo.tag_name_font_size == 0? this.geofencesService.defaultTagNameFontSize: geo.tag_name_font_size) + 'px';

        geo.marker_name = L.circleMarker(centerPoligon, {
          // pane: 'markers1',
          "radius": 0,
          "fillColor": "#000",//color,
          "fillOpacity": 1,
          "color": "#000",//color,
          "weight": 1,
          "opacity": 1

        }).bindTooltip(
            // "<div style='background:blue;'><b>" + this.geofences[i].zone_name+ "</b></div>",//,
            // '<b class="" style="-webkit-text-stroke: 0.5px black; color: '+geo.zone_color+';">'+geo.zone_name+'</b>',
            '<b class="" style="background-color: '+ bg_color +'; color : '+ txt_color +'; font-size: ' + font_size + '">'+geo.zone_name+'</b>',
            { permanent: true,
              // offset: [-100, 0],
              direction: 'center',
              className: 'leaflet-tooltip-own geofence-tooltip',
            });

        if (geo.zone_name_visible == 'true') {
          geo.marker_name.addTo(this.mapService.map);
        }
        this.spinner.hide('spinnerLoading');
        // geo.geo_elemento.setLatLngs( this.getCoordenadas( JSON.parse(geo.geo_coordenadas).coordinates[0] ));
        // geo.zone_vertices: "( -71.5331196784973 -16.40000880639486, -71.53320550918579 -16.400255801861498, -71.53292655944824 -16.400358724922672, -71.53284072875977 -16.40011170948444,-71.5331196784973 -16.40000880639486)"
        // //console.log(geo);
        console.log("mostrar Swalllll");
        Swal.fire(
            'Modificado',
            'Se modificó correctamente!!',
            'success'
        );
        this.spinner.hide('spinnerLoading');
        return;
      });

    } else {

      if(this.poligonAdd._latlngs[0].length != 0){
        this.poligonAdd.editing.disable();
        
        this.form.geo_geometry = this.layerToPoints(this.poligonAdd,'POLYGON');
        this.geofencesService.store(this.form).then( (res1) => {
          //console.log("---clickGuardar NUEVO----");
          console.log("mensage ", res1);
          this.geofencesService.nameComponentPol =  "LISTAR";
          if(res1[1]=='Registro Guardados'){
            console.log('suseeec');
          }
          let gNew = res1[2];
          let gNew2 = res1[3][0];
          // var geo = this.geofencesService.geofences.filter((item:any)=> item.id == gEdit.id)[0];
          // geo.merge(res1[2]);
          // geo = Object.assign(geo, res1[2]);
          var geo:any = {};
          geo.id = gNew.id;

          geo.descripcion = gNew.descripcion;
          geo.orden = gNew.nombre_zona;
          geo.vel2_zona = gNew.vel2_zona;
          geo.vel3_zona = gNew.vel3_zona;
          geo.vel_act_zona = gNew.vel_act_zona;
          geo.vel_max = gNew.vel_max;
          geo.vel_zona = gNew.vel_zona;
          geo.zone_cat = gNew.categoria_zona;
          geo.zone_color = gNew.color_zona;
          geo.zone_name = gNew.nombre_zona;
          geo.zone_name_visible = gNew.nombre_visible_zona;
          geo.zone_name_visible_bol = (geo.zone_name_visible === 'true');
          // geo.zone_vertices: "( -71.5331196784973 -16.40000880639486, -71.53320550918579 -16.400255801861498, -71.53292655944824 -16.400358724922672, -71.53284072875977 -16.40011170948444,-71.5331196784973 -16.40000880639486)"
          geo.zone_visible = gNew.visible_zona;

          geo.tag_name_color = gNew.tag_name_color;
          geo.tag_name_font_size = gNew.tag_name_font_size;

          geo.geo_coordenadas = gNew2.geo_coordenadas;
          geo.idgrupo = gNew.grupo_convoy_id ?? '0';
          geo.idoperation = gNew.operation_grupo_id ?? '0';
          geo.nameoperation = this.getNameOperation(geo.idoperation);
          geo.namegrupo = this.getNameGrupo(geo.idgrupo);

          //console.log(geo);

          this.mapService.map.removeLayer(this.poligonAdd);
          geo.geo_elemento = new L.Polygon( this.getCoordenadas( JSON.parse(gNew2.geo_coordenadas).coordinates[0] ), {
            weight: 3,
            fill: true,
            color: geo.zone_color //'#000000'
          }).addTo(this.mapService.map);

          this.geofencesService.bindMouseEvents(geo);

          var centerPoligon = geo.geo_elemento.getBounds().getCenter();

          let bg_color = this.geofencesService.tooltipBackgroundTransparent? this.geofencesService.defaultTagNameBackground: this.mapService.hexToRGBA(geo.zone_color);
          let txt_color = this.geofencesService.tooltipBackgroundTransparent? (geo.tag_name_color == ''? this.geofencesService.defaultTagNameColor: geo.tag_name_color): this.mapService.hexToRGBA(geo.zone_color);
          let font_size = (geo.tag_name_font_size == 0? this.geofencesService.defaultTagNameFontSize: geo.tag_name_font_size) + 'px';

          geo.marker_name = L.circleMarker(centerPoligon, {
            // pane: 'markers1',
            "radius": 0,
            "fillColor": "#000",//color,
            "fillOpacity": 1,
            "color": "#000",//color,
            "weight": 1,
            "opacity": 1

          }).bindTooltip(
              // "<div style='background:blue;'><b>" + this.geofences[i].zone_name+ "</b></div>",//,
              // '<b class="" style="-webkit-text-stroke: 0.5px black; color: '+this.geofences[i].zone_color+';">'+this.geofences[i].zone_name+'</b>',
              '<b class="" style="background-color: '+ bg_color +'; color : '+ txt_color +'; font-size: '+ font_size  +'">'+geo.zone_name+'</b>',
              { permanent: true,
                // offset: [-100, 0],
                direction: 'center',
                className: 'leaflet-tooltip-own geofence-tooltip',
              });

          geo.marker_name.addTo(this.mapService.map);

          this.geofencesService.geofences.push(geo);
          this.spinner.hide('spinnerLoading');
          this.geofencesService.initializeTable(geo.id);
          this.geofencesService.updateGeoCounters();
          this.geofencesService.updateGeoTagCounters();
          this.geofencesService.eyeInputSwitch = this.geofencesService.geofenceCounters.visible != 0;
          this.geofencesService.tagNamesEyeState = this.geofencesService.geofenceTagCounters.visible != 0;

          Swal.fire(
              'Creado',
              'Se creó correctamente!!',
              'success'
          );
          this.spinner.hide('spinnerLoading');
          return;

        });
      }else{

        this.spinner.hide('spinnerLoading');

        this.poligonAdd = this.mapService.map.editTools.startPolygon();
        this.changeGeoColor(this.form.id);
        this.poligonAdd.editing.enable();

        Swal.fire({
          title: 'Error',
          text: 'La geocerca no puede quedar vacía.',
          icon: 'warning',
        });
        return;
      }
    }

    //Despues de agregar o editar, ordena el array de geocercas por el atributo orden(nombre de la geocerca en mayuscula)
    this.geofencesService.geofences.sort(function (a:any, b:any){
      return a.orden.localeCompare(b.orden, 'en', { numeric: true })
    });

    // PUT|PATCH | api/zone/{zone}                         | zone.update                       | App\Http\Controllers\Api\V1\ZoneController@update
  }

  clickSaveCir(id:number){
    if(this.form.nombre == null  || this.form.nombre.trim() == '' || this.form.nombre.trim().length == 0){
      Swal.fire({
        title: 'Error',
        text: 'El nombre de la geocerca no puede quedar vacío.',
        icon: 'warning',
      });
      return;
    }

    this.spinner.show('spinnerLoading');

    this.form.radio = (this.poligonAddCir.getRadius()/1000).toFixed(2);

    if ( this.action == "edit" ) {

      var geo0 = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == id)[0];
      this.form.geo_geometry = this.createGeometryString(this.poligonAddCir);

      this.circularGeofencesService.edit(this.form).subscribe((res) => {

        this.geofencesService.nameComponentPol = "LISTAR";

        let gEdit = res[2];
        let gEdit2 = res[3][0];
        var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == gEdit.id)[0];


        geo.descripcion = gEdit.descripcion;
        geo.orden = gEdit.var_nombre;
        geo.tag_name_color = gEdit.tag_name_color;
        geo.tag_name_font_size = gEdit.tag_name_font_size;
        geo.zone_name_visible = gEdit.bol_mostrar_nombre;
        geo.zone_name_visible_bol = (gEdit.zone_name_visible == 'true');
        geo.zone_visible = gEdit.bol_mostrar;
        geo.geo_coordenadas = gEdit.geo_coordenadas;
        geo.zone_color = gEdit.var_color;
        geo.zone_name = gEdit.var_nombre;
        geo.zone_cat = gEdit.int_categoria;
        geo.vel_act_zona = gEdit.bol_limite_velocidad_activo;
        geo.int_limite_velocidad_0 = gEdit.int_limite_velocidad_0;
        geo.int_limite_velocidad_1 = gEdit.int_limite_velocidad_1;
        geo.int_limite_velocidad_2 = gEdit.int_limite_velocidad_2;
        geo.int_limite_velocidad_3 = gEdit.int_limite_velocidad_3;
        geo.zone_no_int_color = gEdit.bol_sin_relleno;
        geo.idgrupo = gEdit.grupo_convoy_id ?? '0';
        geo.idoperation = gEdit.operation_grupo_id ?? '0';
        geo.nameoperation = this.getNameOperation(geo.idoperation);
        geo.namegrupo = this.getNameGrupo(geo.idgrupo);


        this.mapService.map.removeLayer(geo.geo_elemento);
        this.mapService.map.removeLayer(geo.marker_name);

        geo.geo_elemento = new L.Circle( this.circularGeofencesService.getCoordenadas(geo.geo_coordenadas), {
          radius: this.circularGeofencesService.getRadius(geo.geo_coordenadas),
          weight: 3,
          fill: geo.zone_no_int_color,
          color: geo.zone_color,
        });

        this.circularGeofencesService.bindMouseEvents(geo);

        if (geo.zone_visible == 'true') {
          geo.geo_elemento.addTo(this.mapService.map);
        }

        let bg_color = this.circularGeofencesService.tooltipBackgroundTransparent? this.circularGeofencesService.defaultTagNameBackground: this.mapService.hexToRGBA(geo.zone_color);
        let txt_color = this.circularGeofencesService.tooltipBackgroundTransparent? (geo.tag_name_color == ''? this.circularGeofencesService.defaultTagNameColor: geo.tag_name_color): this.mapService.hexToRGBA(geo.zone_color);
        let font_size = (geo.tag_name_font_size == 0? this.circularGeofencesService.defaultTagNameFontSize: geo.tag_name_font_size) + 'px';

        geo.marker_name = L.circleMarker(this.circularGeofencesService.getCoordenadas(geo.geo_coordenadas), {
            "radius": 0,
            "fillColor": "#000",//color,
            "fillOpacity": 1,
            "color": "#000",//color,
            "weight": 1,
            "opacity": 1

          }).bindTooltip(
              '<b class="" style="background-color: '+ bg_color +'; color : '+ txt_color +'; font-size: '+ font_size  +'">'+geo.zone_name+'</b>',
              { permanent: true,
                direction: 'center',
                className: 'leaflet-tooltip-own',
          });
        
        if (geo.zone_name_visible == 'true') {
          geo.marker_name.addTo(this.mapService.map);
        }
  
        this.spinner.hide('spinnerLoading');

      });

    } else {
      //creacion de geocercacircular
      if(this.poligonAddCir.getRadius() != 10){

        this.form.geo_geometry = this.createGeometryString(this.poligonAddCir);
        this.circularGeofencesService.store(this.form).subscribe( (resp: any) => {
          console.log(resp);
          this.geofencesService.nameComponentPol = "LISTAR";
          if(resp[1]=='Registro Guardados'){
            console.log('suseed');
          }

          let gNew = resp[2];
          let gNew2 = resp[3][0];

          var geo:any = {};
          geo.id = gNew.id;
        
          geo.descripcion = gNew.descripcion;
          geo.orden = gNew.var_nombre;
          geo.tag_name_color = gNew.tag_name_color;
          geo.tag_name_font_size = gNew.tag_name_font_size;
          geo.zone_name_visible = gNew.bol_mostrar_nombre;
          geo.zone_name_visible_bol = (gNew.zone_name_visible == 'true');
          geo.zone_visible = gNew.bol_mostrar;
          geo.geo_coordenadas = gNew2.geo_coordenadas;
          geo.zone_color = gNew.var_color;
          geo.zone_name = gNew.var_nombre;
          geo.zone_cat = gNew.int_categoria;
          geo.vel_act_zona = gNew.bol_limite_velocidad_activo;
          geo.int_limite_velocidad_0 = gNew.int_limite_velocidad_0;
          geo.int_limite_velocidad_1 = gNew.int_limite_velocidad_1;
          geo.int_limite_velocidad_2 = gNew.int_limite_velocidad_2;
          geo.int_limite_velocidad_3 = gNew.int_limite_velocidad_3;
          geo.zone_no_int_color = true;
          geo.idgrupo = gNew.grupo_convoy_id ?? '0';
          geo.idoperation = gNew.operation_grupo_id ?? '0';
          geo.nameoperation = this.getNameOperation(geo.idoperation);
          geo.namegrupo = this.getNameGrupo(geo.idgrupo);

          this.mapService.map.removeLayer(this.poligonAddCir);

          geo.geo_elemento = new L.Circle( this.circularGeofencesService.getCoordenadas(geo.geo_coordenadas), {
            radius: this.circularGeofencesService.getRadius(geo.geo_coordenadas),
            weight: 3,
            fill: geo.zone_no_int_color,
            color: geo.zone_color,
          });

          this.circularGeofencesService.bindMouseEvents(geo);

          let bg_color = this.circularGeofencesService.tooltipBackgroundTransparent? this.circularGeofencesService.defaultTagNameBackground: this.mapService.hexToRGBA(geo.zone_color);
          let txt_color = this.circularGeofencesService.tooltipBackgroundTransparent? (geo.tag_name_color == ''? this.circularGeofencesService.defaultTagNameColor: geo.tag_name_color): this.mapService.hexToRGBA(geo.zone_color);
          let font_size = (geo.tag_name_font_size == 0? this.circularGeofencesService.defaultTagNameFontSize: geo.tag_name_font_size) + 'px';

          geo.marker_name = L.circleMarker(this.circularGeofencesService.getCoordenadas(geo.geo_coordenadas), {
            "radius": 0,
            "fillColor": "#000",//color,
            "fillOpacity": 1,
            "color": "#000",//color,
            "weight": 1,
            "opacity": 1

          }).bindTooltip(
              '<b class="" style="background-color: '+ bg_color +'; color : '+ txt_color +'; font-size: '+ font_size  +'">'+geo.zone_name+'</b>',
              { permanent: true,
                direction: 'center',
                className: 'leaflet-tooltip-own',
              });

          geo.marker_name.addTo(this.mapService.map);

          this.circularGeofencesService.circular_geofences.push(geo);
          this.spinner.hide('spinnerLoading');
          this.circularGeofencesService.initializeTable(geo.id);
          this.circularGeofencesService.updateGeoCounters();
          this.circularGeofencesService.updateGeoTagCounters();
          this.circularGeofencesService.eyeInputSwitch = (this.circularGeofencesService.circularGeofenceCounters.visible != 0);
          this.circularGeofencesService.tagNamesEyeState = (this.circularGeofencesService.circularGeofenceCounters.visible != 0);

        })

      }else{

        this.spinner.hide('spinnerLoading');

        this.poligonAddCir = this.mapService.map.editTools.startCircle();
        this.changeGeoColorCir(this.form.id);

        Swal.fire({
          title: 'Error',
          text: 'La geocerca no puede quedar vacía.',
          icon: 'warning',
        });
        return;
      }
    }

    this.circularGeofencesService.circular_geofences.sort(function (a:any, b:any){
      return a.orden.localeCompare(b.orden, 'en', { numeric: true })
    });

  }

  changeGeoColor(id:number) {

    let newColor = this.form.color;

    if ( this.geofencesService.action == "edit" ) {
        var geo = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];
        geo.geo_elemento.setStyle({opacity: 1, color: newColor });

    } else {
        // //console.log("CREACION DE GEOCERCA");
        this.poligonAdd.setStyle({opacity: 1, color: newColor });
    }
  }
  changeGeoColorCir(id:number) {
    let newColor = this.form.color;
    if ( this.circularGeofencesService.action == "edit" ) {
        var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == id)[0];
        geo.geo_elemento.setStyle({opacity: 1, color: newColor });
    } else {
        this.poligonAddCir.setStyle({opacity: 1, color: newColor });
    }
  }
  // changeGeoFillCir(id:number) {
  //   let newFill = this.form.zone_no_int_color;
  //   if ( this.circularGeofencesService.action == "edit" ) {
  //       var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == id)[0];
  //       geo.geo_elemento.setStyle({opacity: 1, fill: newFill });
  //   } else {
  //       this.poligonAddCir.setStyle({opacity: 1, fill: newFill });
  //   }
  // }

  getCoordenadas(data:any){
    let coo = [];
    for (let i = 0; i < data.length; i++) {
      coo.push([data[i][1],data[i][0]]);
    };
    return coo;
  }
  getCircleArea (radius:any) {
    radius = parseFloat(radius);
    let area = Math.PI * Math.pow(radius,2);
    return Math.abs(area);
  };

}


