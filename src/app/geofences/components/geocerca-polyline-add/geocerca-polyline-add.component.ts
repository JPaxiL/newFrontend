import { Component, ElementRef, HostListener, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MapServicesService } from 'src/app/map/services/map-services.service';
import { PolylineGeogencesService } from '../../services/polyline-geogences.service';
import * as L from 'leaflet';
import 'leaflet-paintpolygon';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-geocerca-polyline-add',
  templateUrl: './geocerca-polyline-add.component.html',
  styleUrls: ['./geocerca-polyline-add.component.scss']
})
export class GeocercaPolylineAddComponent implements OnInit, OnDestroy {

  form :any = {};
  poligonAdd!: L.Polyline;

  isDraw: boolean = true;
  isErase: boolean = false;
  isRadiusActive: boolean = false;

  private _radius: number = 30;

  get radius(){
    return this._radius
  }

  set radius(value){
    this._radius = value;
    this.polylineGeofenceService.paintpolygonControl.setRadius(this._radius);
  }

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

  constructor(private polylineGeofenceService: PolylineGeogencesService,
              private spinner: NgxSpinnerService,
              private mapService: MapServicesService) { }


  ngOnInit(): void {


    if(this.action == "edit"){

      this.llenar_formulario();

      var geo = this.polylineGeofenceService.polyline_geofences.filter((item:any)=> item.id == this.polylineGeofenceService.idGeocercaEdit)[0];
      
      // console.log(geo);

      if (geo.zone_visible == true) {

        // console.log('Eliminando geocerca porque era visible');
        this.mapService.map.removeLayer(geo.geo_elemento);

      }

      geo.geo_elemento = new L.Polygon( this.polylineGeofenceService.getCoordenadas( JSON.parse(geo.geo_coordenadas).coordinates[0] ), {
        weight: 3,
        fill: true,
        color: geo.zone_color,
      });

      var centerPoligon = geo.geo_elemento.getBounds().getCenter();

      this.poligonAdd = geo.geo_elemento.addTo(this.mapService.map);
      geo.geo_elemento.addTo(this.mapService.map);
      geo.geo_elemento.editing.enable();


    }else{

      this.nuevo_formulario();

      // this.poligonAdd = this.mapService.map.editTools.startPolyline(undefined, {
      //   opacity: 0.3,
      //   color: '#ff0000',
      //   weight: 20,
      // });

      this.polylineGeofenceService.paintpolygonControl.stop();
      this.polylineGeofenceService.paintpolygonControl.startDraw();
      //this.changeGeoColor(this.form.id);


    }



  }

  ngOnDestroy(){

    this.polylineGeofenceService.paintpolygonControl.stop();

    if ( this.action == "edit" ) {

      var geo = this.polylineGeofenceService.polyline_geofences.filter((item:any)=> item.id == this.polylineGeofenceService.idGeocercaEdit)[0];

          this.mapService.map.removeLayer(geo.geo_elemento);

          geo.geo_elemento = new L.Polygon( this.polylineGeofenceService.getCoordenadas( JSON.parse(geo.geo_coordenadas).coordinates[0] ), {
            weight: 3,
            fill: true,
            color: geo.zone_color //'#000000'
          });

          this.polylineGeofenceService.bindMouseEvents(geo);

          if (geo.zone_visible == true) {
            geo.geo_elemento.addTo(this.mapService.map);
          }

    } else {

      this.polylineGeofenceService.paintpolygonControl.eraseAll();
      this.polylineGeofenceService.paintpolygonControl.stop();

    }

    for(let i = 0; i < this.polylineGeofenceService.polyline_geofences.length; i++){
      this.polylineGeofenceService.clearDrawingsOfGeofence(this.polylineGeofenceService.polyline_geofences[i]);
    }
    
    for(let i = 0; i < this.polylineGeofenceService.polyline_geofences.length; i++){
      this.polylineGeofenceService.showDrawingsOfGeofence(this.polylineGeofenceService.polyline_geofences[i]);
    }


  }


  get action(){

    return this.polylineGeofenceService.action;
  }


  // changeGeoColor(id:number) {

  //   let newColor = this.form.color;

  //   if ( this.action == "edit" ) {
  //       var geo = this.polylineGeofenceService.polyline_geofences.filter((item:any)=> item.id == id)[0];
  //       geo.geo_elemento.setStyle({opacity: 1, color: newColor });

  //   } else {
  //       this.poligonAdd.setStyle({opacity: 1, color: newColor });
  //   }

  // }

  llenar_formulario(){
    var geo = this.polylineGeofenceService.polyline_geofences.filter((item:any)=> item.id == this.polylineGeofenceService.idGeocercaEdit)[0];

    this.mapService.map.fitBounds(geo.geo_elemento.getBounds());

    this.form.id = geo.id;
    this.form.nombre = geo.zone_name;
    this.form.descripcion = geo.zone_descripcion;

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

    this.form.tag_name_color = /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(geo.tag_name_color)? geo.tag_name_color : this.polylineGeofenceService.defaultTagNameColor;
    this.form.tag_name_font_size = this.polylineGeofenceService.defaultTagNameFontSize; //px
    for(let i = 0; i< this.fontSizeOptions.length; i++){
      if(this.fontSizeOptions[i].value == geo.tag_name_font_size){
        this.form.tag_name_font_size = geo.tag_name_font_size;
      }
    }

  }

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

    this.form.zone_type = 'POLYLINE';

    this.form.tag_name_color = this.polylineGeofenceService.defaultTagNameColor;
    this.form.tag_name_font_size = this.polylineGeofenceService.defaultTagNameFontSize; //px

    this.form.limite_velocidad = 0;
    this.form.limite_tolerable = 0;
    this.form.limite_grave = 0;
    this.form.limite_muy_grave = 0;

    this.form.visible_zona         = true;
    this.form.nombre_visible_zona  = true;

    this.form.geo_geometry          = "( -71.5331196784973 -16.40000880639486, -71.53320550918579 -16.400255801861498, -71.53292655944824 -16.400358724922672, -71.53284072875977 -16.40011170948444,-71.5331196784973 -16.40000880639486)";
    
  }

  layerToPoints(object:any, type:string, action: string) {
    var geoElement = '';
    let latlngs;
    let lat,lng;

    switch (type) {
      case 'POLYGON':

        if(action == 'edit') {
          
          latlngs = object.getLatLngs()[0];
          lat='lat';
          lng='lng';
        }else{

          latlngs = object;
          lat=0;
          lng=1;
        }

        for (var i = 0, total = latlngs.length; i < total; i++) {
          geoElement += ` ${latlngs[i][lng]} ${latlngs[i][lat]}`;
          if (i < total-1) {
            geoElement += ',';
          }else {
            geoElement += `,${latlngs[0][lng]} ${latlngs[0][lat]}`;
          }
        }

        geoElement = `(${geoElement})`;
        break;
    }
    return geoElement;

   }

  clickCancelar(id:number){

    this.polylineGeofenceService.nombreComponente = "LISTAR";

    var geo = this.polylineGeofenceService.polyline_geofences.filter((item:any)=> item.id == id)[0];
    if ( this.action == "edit" ) {

      this.mapService.map.removeLayer(geo.geo_elemento);

      geo.geo_elemento = new L.Polygon( this.polylineGeofenceService.getCoordenadas( JSON.parse(geo.geo_coordenadas).coordinates[0] ), {
        weight: 3,
        fill: true,
        color: geo.zone_color 
      });

      this.polylineGeofenceService.bindMouseEvents(geo);

      if (geo.zone_visible == true) {
        geo.geo_elemento.addTo(this.mapService.map);
      }

    } else {

      this.polylineGeofenceService.paintpolygonControl.eraseAll();
      this.polylineGeofenceService.paintpolygonControl.stop();
    }

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

    if ( this.polylineGeofenceService.action == "edit" ) {

      var geo0 = this.polylineGeofenceService.polyline_geofences.filter((item:any)=> item.id == id)[0];
      
      
      this.form.geo_geometry = this.layerToPoints(geo0.geo_elemento,'POLYGON','edit');

      geo0.geo_elemento.editing.disable();

      // console.log(this.form.geo_geometry);

      this.polylineGeofenceService.edit(this.form).subscribe(res1 => {

        this.polylineGeofenceService.nombreComponente =  "LISTAR";


        let gEdit = res1[2];
        let gEdit2 = res1[3][0];

        var geo = this.polylineGeofenceService.polyline_geofences.filter((item:any)=> item.id == gEdit.id)[0];

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
        geo.zone_name_visible_bol = (geo.zone_name_visible === true);
        geo.zone_visible = gEdit.visible_zona;
        geo.tag_name_color = gEdit.tag_name_color;
        geo.tag_name_font_size = gEdit.tag_name_font_size;

        geo.geo_coordenadas = gEdit2.geo_coordenadas;

        this.mapService.map.removeLayer(geo.geo_elemento);
        this.mapService.map.removeLayer(geo.marker_name);

        geo.geo_elemento = new L.Polygon( this.polylineGeofenceService.getCoordenadas( JSON.parse(gEdit2.geo_coordenadas).coordinates[0] ), {
          weight: 3,
          fill: true,
          color: geo.zone_color //'#000000'
        });

        this.polylineGeofenceService.bindMouseEvents(geo);

        if (geo.zone_visible == true) {
          geo.geo_elemento.addTo(this.mapService.map);
        }

        var centerPoligon = geo.geo_elemento.getBounds().getCenter();

        let bg_color = this.polylineGeofenceService.tooltipBackgroundTransparent? this.polylineGeofenceService.defaultTagNameBackground: this.mapService.hexToRGBA(geo.zone_color);
        let txt_color = this.polylineGeofenceService.tooltipBackgroundTransparent? (geo.tag_name_color == ''? this.polylineGeofenceService.defaultTagNameColor: geo.tag_name_color): this.mapService.hexToRGBA(geo.zone_color);
        let font_size = (geo.tag_name_font_size == 0? this.polylineGeofenceService.defaultTagNameFontSize: geo.tag_name_font_size) + 'px';

        geo.marker_name = L.circleMarker(centerPoligon, {
          // pane: 'markers1',
          "radius": 0,
          "fillColor": "#000",//color,
          "fillOpacity": 1,
          "color": "#000",//color,
          "weight": 1,
          "opacity": 1

        }).bindTooltip(
            
            '<b class="" style="background-color: '+ bg_color +'; color : '+ txt_color +'; font-size: ' + font_size + '">'+geo.zone_name+'</b>',
            { permanent: true,
              // offset: [-100, 0],
              direction: 'center',
              className: 'leaflet-tooltip-own geofence-tooltip',
            });


        if (geo.zone_name_visible == true) {
          geo.marker_name.addTo(this.mapService.map);
        }

        this.spinner.hide('spinnerLoading');

      })



    } else {

      const layers = this.polylineGeofenceService.paintpolygonControl.getData();

      if(layers.geometry.coordinates[0][0]){

        const coordinates = layers.geometry.coordinates[0][0];
        let new_coordinates = [];
        let step = 1;
        let cont = 0;

        if(coordinates.length <= 200){

          step = 1;

        }else{

          step = Math.round((coordinates.length/200));

        }

        for (let index = 0; index < coordinates.length; index += step) {
          new_coordinates[cont] = [coordinates[index][1],coordinates[index][0]];
          cont++;
        }

        this.form.geo_geometry = this.layerToPoints(new_coordinates,'POLYGON','add');


        this.polylineGeofenceService.store(this.form).subscribe(res => {

          this.polylineGeofenceService.nombreComponente =  "LISTAR";

          let gNew = res[2];
          let gNew2 = res[3][0];
          
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
          geo.zone_name_visible_bol = (geo.zone_name_visible == true);
          geo.zone_visible = gNew.visible_zona;

          geo.tag_name_color = gNew.tag_name_color;
          geo.tag_name_font_size = gNew.tag_name_font_size;

          geo.geo_coordenadas = gNew2.geo_coordenadas;

          this.polylineGeofenceService.paintpolygonControl.eraseAll();
          this.polylineGeofenceService.paintpolygonControl.stop();

          geo.geo_elemento = new L.Polygon( this.polylineGeofenceService.getCoordenadas( JSON.parse(gNew2.geo_coordenadas).coordinates[0] ), {
            weight: 3,
            fill: true,
            color: geo.zone_color 
          }).addTo(this.mapService.map);

          this.polylineGeofenceService.bindMouseEvents(geo);

          var centerPoligon = geo.geo_elemento.getBounds().getCenter();

          let bg_color = this.polylineGeofenceService.tooltipBackgroundTransparent? this.polylineGeofenceService.defaultTagNameBackground: this.mapService.hexToRGBA(geo.zone_color);
          let txt_color = this.polylineGeofenceService.tooltipBackgroundTransparent? (geo.tag_name_color == ''? this.polylineGeofenceService.defaultTagNameColor: geo.tag_name_color): this.mapService.hexToRGBA(geo.zone_color);
          let font_size = (geo.tag_name_font_size == 0? this.polylineGeofenceService.defaultTagNameFontSize: geo.tag_name_font_size) + 'px';


          geo.marker_name = L.circleMarker(centerPoligon, {
            // pane: 'markers1',
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
                className: 'leaflet-tooltip-own geofence-tooltip',
              });

          geo.marker_name.addTo(this.mapService.map);


          this.polylineGeofenceService.polyline_geofences.push(geo);
          this.spinner.hide('spinnerLoading');
          this.polylineGeofenceService.initializeTable(geo.id);
          this.polylineGeofenceService.updateGeoCounters();
          this.polylineGeofenceService.updateGeoTagCounters();
          this.polylineGeofenceService.eyeInputSwitch = this.polylineGeofenceService.polylineGeofenceCounters.visible != 0;
          this.polylineGeofenceService.tagNamesEyeState = this.polylineGeofenceService.polylineGeofenceTagCounters.visible != 0;

        });
      }else{

        this.spinner.hide('spinnerLoading');

        Swal.fire({
          title: 'Error',
          text: 'La geocerca no puede quedar vacía.',
          icon: 'warning',
        });
        return;
      }
    }

    this.polylineGeofenceService.polyline_geofences.sort(function (a:any, b:any){
      return a.orden.localeCompare(b.orden, 'en', { numeric: true })
    });

  }

  draw(action: string){

    switch(action){
      case 'draw':
        this.isDraw = !this.isDraw;
        if(this.isDraw){

          this.polylineGeofenceService.paintpolygonControl.startDraw();
          this.isErase = false;
        }else{
          this.polylineGeofenceService.paintpolygonControl.stop();
        }
        break;
      case 'erase':
        this.isErase = !this.isErase;
        if(this.isErase){
          this.polylineGeofenceService.paintpolygonControl.startErase();
          this.isDraw = false;
        }else{
          
          this.polylineGeofenceService.paintpolygonControl.stop();
        }
        break;
    }
  }


}
