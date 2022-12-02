import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MapServicesService } from 'src/app/map/services/map-services.service';
import { CircularGeofencesService } from '../../services/circular-geofences.service';
import * as L from 'leaflet';
import 'leaflet-editable';
import 'leaflet-path-drag';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-geocerca-circular-add',
  templateUrl: './geocerca-circular-add.component.html',
  styleUrls: ['./geocerca-circular-add.component.scss']
})
export class GeocercaCircularAddComponent implements OnInit, OnDestroy {

  form :any = {};
  poligonAdd!: L.Circle;
  
  booleanOptions = [
    { label: 'Sí', value: true },
    { label: 'No', value: false },
  ];

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
  ];

  measurementUnits = [
    {id: 'm', factor: 1},
    {id: 'km', factor: 0.001}
  ];


  constructor(private circularGeofencesService: CircularGeofencesService,
              private spinner: NgxSpinnerService,
              private mapService: MapServicesService) { }

  ngOnInit(): void {

    if(this.action == "edit"){

      this.llenar_formulario();

      var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == this.circularGeofencesService.idGeocercaEdit)[0];

      if (geo.zone_visible == true) {

        console.log('Eliminando geocerca porque era visible');
        this.mapService.map.removeLayer(geo.geo_elemento);

      }


      geo.geo_elemento = new L.Circle( this.circularGeofencesService.getCoordenadas(geo.geo_coordenadas), {
        radius: this.circularGeofencesService.getRadius(geo.geo_coordenadas),
        weight: 3,
        fill: geo.zone_no_int_color,
        color: geo.zone_color,
      });
      this.poligonAdd = geo.geo_elemento.addTo(this.mapService.map);
      // geo.geo_elemento.editing.enable();

      this.poligonAdd.enableEdit();


    }else{

      this.nuevo_formulario();

      this.poligonAdd = this.mapService.map.editTools.startCircle();

      this.changeGeoColor(this.form.id);

    }


    this.poligonAdd.on('editable:editing', (event) => {

      let radio = (event.layer.getRadius()/1000).toFixed(2);

      this.form.radio = radio;

      this.form.area = this.getCircleArea(radio).toFixed(2);
    })


  }

  ngOnDestroy(){

    this.poligonAdd.off();

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

          if (geo.zone_visible == true) {
            geo.geo_elemento.addTo(this.mapService.map);
          }

    } else {
      this.mapService.map.removeLayer(this.poligonAdd);
    }

    for(let i = 0; i < this.circularGeofencesService.circular_geofences.length; i++){
      this.circularGeofencesService.clearDrawingsOfGeofence(this.circularGeofencesService.circular_geofences[i]);
    }
    // this.circularGeofencesService.sortGeofencesBySize();
    for(let i = 0; i < this.circularGeofencesService.circular_geofences.length; i++){
      this.circularGeofencesService.showDrawingsOfGeofence(this.circularGeofencesService.circular_geofences[i]);
    }


  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.mapService.map.editTools.stopDrawing();
  }

  get action(){

    return this.circularGeofencesService.action;
  }

  changeGeoColor(id:number) {

    let newColor = this.form.color;

    if ( this.action == "edit" ) {
        var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == id)[0];
        geo.geo_elemento.setStyle({opacity: 1, color: newColor });

    } else {
        this.poligonAdd.setStyle({opacity: 1, color: newColor });
    }

  }


  changeGeoFill(id:number) {

    let newFill = this.form.zone_no_int_color;

    if ( this.action == "edit" ) {
        var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == id)[0];
        geo.geo_elemento.setStyle({opacity: 1, fill: newFill });

    } else {
        this.poligonAdd.setStyle({opacity: 1, fill: newFill });
    }

  }

  llenar_formulario(){
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

    console.log(geo);

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

  clickCancelar(id:number){

    this.circularGeofencesService.nombreComponente = "LISTAR";

    var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == id)[0];
    if ( this.action == "edit" ) {

      this.mapService.map.removeLayer(geo.geo_elemento);
      geo.geo_elemento = new L.Circle( this.circularGeofencesService.getCoordenadas(geo.geo_coordenadas), {
        radius: this.circularGeofencesService.getRadius(geo.geo_coordenadas),
        weight: 3,
        fill: geo.zone_no_int_color,
        color: geo.zone_color,
      });

      this.circularGeofencesService.bindMouseEvents(geo);

      if (geo.zone_visible == true) {
        geo.geo_elemento.addTo(this.mapService.map);
      }

    } else {

      this.mapService.map.removeLayer(this.poligonAdd);
    }

  }

  createGeometryString(figure: L.Circle){

    //"<(-2.98692739333486,-69.43359375),671103.240326455>"
    //"<(-7.466705320402595,-76.33300781250001),189685.38698446512>"
    return `<(${figure.getLatLng().lat},${figure.getLatLng().lng}),${figure.getRadius()}>`

  }

  clickGuardar(id:number){
    if(this.form.nombre == null  || this.form.nombre.trim() == '' || this.form.nombre.trim().length == 0){
      Swal.fire({
        title: 'Error',
        text: 'El nombre de la geocerca no puede quedar vacío.',
        icon: 'warning',
      });
      return;
    }

    this.spinner.show('spinnerLoading');

    this.form.radio = (this.poligonAdd.getRadius()/1000).toFixed(2);

    if ( this.action == "edit" ) {

      var geo0 = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == id)[0];
      this.form.geo_geometry = this.createGeometryString(this.poligonAdd);

      this.circularGeofencesService.edit(this.form).subscribe((res) => {

        this.circularGeofencesService.nombreComponente =  "LISTAR";

        let gEdit = res[2];
        let gEdit2 = res[3][0];
        var geo = this.circularGeofencesService.circular_geofences.filter((item:any)=> item.id == gEdit.id)[0];


        geo.descripcion = gEdit.descripcion;
        geo.orden = gEdit.var_nombre;
        geo.tag_name_color = gEdit.tag_name_color;
        geo.tag_name_font_size = gEdit.tag_name_font_size;
        geo.zone_name_visible = gEdit.bol_mostrar_nombre;
        geo.zone_name_visible_bol = (gEdit.zone_name_visible === true);
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


        this.mapService.map.removeLayer(geo.geo_elemento);
        this.mapService.map.removeLayer(geo.marker_name);

        geo.geo_elemento = new L.Circle( this.circularGeofencesService.getCoordenadas(geo.geo_coordenadas), {
          radius: this.circularGeofencesService.getRadius(geo.geo_coordenadas),
          weight: 3,
          fill: geo.zone_no_int_color,
          color: geo.zone_color,
        });

        this.circularGeofencesService.bindMouseEvents(geo);

        if (geo.zone_visible == true) {
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
        
        if (geo.zone_name_visible == true) {
          geo.marker_name.addTo(this.mapService.map);
        }
  
        this.spinner.hide('spinnerLoading');

      });

    } else {

      if(this.poligonAdd.getRadius() != 10){

        this.form.geo_geometry = this.createGeometryString(this.poligonAdd);

        this.circularGeofencesService.store(this.form).subscribe( (resp: any) => {

          this.circularGeofencesService.nombreComponente =  "LISTAR";

          let gNew = resp[2];
          let gNew2 = resp[3][0];

          var geo:any = {};
          geo.id = gNew.id;
        
          geo.descripcion = gNew.descripcion;
          geo.orden = gNew.var_nombre;
          geo.tag_name_color = gNew.tag_name_color;
          geo.tag_name_font_size = gNew.tag_name_font_size;
          geo.zone_name_visible = gNew.bol_mostrar_nombre;
          geo.zone_name_visible_bol = (gNew.zone_name_visible === true);
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
          geo.zone_no_int_color = gNew.bol_sin_relleno;

          this.mapService.map.removeLayer(this.poligonAdd);

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

        this.poligonAdd = this.mapService.map.editTools.startCircle();
        this.changeGeoColor(this.form.id);

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

  getCircleArea (radius:any) {

    radius = parseFloat(radius);
    
    let area = Math.PI * Math.pow(radius,2);

    return Math.abs(area);
  };

}
