import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';

import { GeofencesService } from '../../services/geofences.service';

import { MapServicesService } from '../../../map/services/map-services.service';

import * as L from 'leaflet';
// import "leaflet-geometryutil";

//import L from "leaflet";
// import '../../node_modules/leaflet-geometryutil/src/leaflet.geometryutil.js';


// import { } from 'leaflet-geometryutil';
// import 'leaflet-geometryutil';

// declare module 'leaflet' {
//   export class GeometryUtil {
//     // static geodesicArea(latlng: L.LatLng): number;
//     static computeAngle(a: L.Point, b: L.Point): number;
//     static closest(map: L.Map, layer: L.Layer, latlng: L.LatLng, vertices?: boolean): L.LatLng;
//   }
// }



@Component({
  selector: 'app-geocerca-add',
  templateUrl: './geocerca-add.component.html',
  styleUrls: ['./geocerca-add.component.scss']
})
export class GeocercaAddComponent implements OnInit {

  form :any = {};
  constructor(
    public geofencesService: GeofencesService,
    public mapService: MapServicesService,

  ) { }

  action:string = "add";

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
    if ( this.geofencesService.action == "edit" ) {
      this.llenar_formulario();
    } else {
      this.nuevo_formulario();
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

    console.log('<<<<<latlngs');
    var geoElement = this.layerToPoints(geo.geo_elemento,'POLYGON');
    console.log("============================ XXXX");
    console.log(geoElement);




  }

  llenar_formulario(){
    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == this.geofencesService.idGeocercaEdit)[0];

    console.log(geo);

    this.mapService.map.fitBounds(geo.geo_elemento.getBounds());

    geo.geo_elemento.editing.enable();

            // updatePerimeterAndArea(vm.polygon.getLatLngs());
    // console.log( "factorArea = "+factorArea );

    // console.log( geo.geo_elemento.getLatLngs() );

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
    // if(!L.GeometryUtil){
    //   import('leaflet-geometryutil')
    //      .then( GeometryUtil => {
    //         console.log('all good')
    //      })
    //      .catch( err => {throw(err)} )
    // }


    // console.log(this.geodesicArea(geo.geo_elemento.getLatLngs()[0]));
    // console.log(this.geodesicArea(geo.geo_elemento.getLatLngs()[0]) * factorArea);


    // console.log(this.getPerimeter(geo.geo_elemento.getLatLngs()[0]));


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
    this.form.categoria = 1;

    this.form.checkVelocidad = false;

    this.form.limite_velocidad = 0;
    this.form.limite_tolerable = 0;
    this.form.limite_grave = 0;
    this.form.limite_muy_grave = 0;

    this.form.visible_zona         = "true";
    this.form.nombre_visible_zona  = "true";

    this.form.geo_geometry          = "( -71.5331196784973 -16.40000880639486, -71.53320550918579 -16.400255801861498, -71.53292655944824 -16.400358724922672, -71.53284072875977 -16.40011170948444,-71.5331196784973 -16.40000880639486)";
    // if(!L.GeometryUtil){
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

  clickCancelar(id:number){
    console.log("---clickCancelar");
    this.geofencesService.nombreComponente = "LISTAR";

    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];
    if ( this.geofencesService.action == "edit" ) {

        this.mapService.map.removeLayer(geo.geo_elemento);

        geo.geo_elemento = new L.Polygon( this.getCoordenadas( JSON.parse(geo.geo_coordenadas).coordinates[0] ), {
          weight: 3,
          fill: true,
          color: geo.zone_color //'#000000'
        }).addTo(this.mapService.map);

    }


    //geo.geo_elemento.setLatLngs( this.getCoordenadas( JSON.parse(geo.geo_coordenadas).coordinates[0] ));
  }

  clickGuardar(id:number){
    console.log("---clickGuardar");

    var geo0 = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];
    this.form.geo_geometry = this.layerToPoints(geo0.geo_elemento,'POLYGON');

    if ( this.geofencesService.action == "edit" ) {
      this.geofencesService.edit(this.form).then( (res1) => {
        console.log("---clickGuardar----");
        console.log(res1);
        this.geofencesService.nombreComponente =  "LISTAR";



        let gEdit = res1[2];
        let gEdit2 = res1[3][0];
        var geo = this.geofencesService.geofences.filter((item:any)=> item.id == gEdit.id)[0];

        geo.geo_elemento.editing.disable();

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
        geo.zone_name_visible_bol = (geo.zone_name_visible === 'true');
        geo.zone_visible = gEdit.visible_zona;

        geo.geo_coordenadas = gEdit2.geo_coordenadas;

        this.mapService.map.removeLayer(geo.geo_elemento);
        geo.geo_elemento = new L.Polygon( this.getCoordenadas( JSON.parse(gEdit2.geo_coordenadas).coordinates[0] ), {
          weight: 3,
          fill: true,
          color: geo.zone_color //'#000000'
        }).addTo(this.mapService.map);



        // geo.geo_elemento.setLatLngs( this.getCoordenadas( JSON.parse(geo.geo_coordenadas).coordinates[0] ));


        // geo.zone_vertices: "( -71.5331196784973 -16.40000880639486, -71.53320550918579 -16.400255801861498, -71.53292655944824 -16.400358724922672, -71.53284072875977 -16.40011170948444,-71.5331196784973 -16.40000880639486)"
        console.log('<<<<<latlngs');


        console.log(geo);
      });

    } else {

      this.geofencesService.store(this.form).then( (res1) => {
        console.log("---clickGuardar NUEVO----");
        console.log(res1);

        this.geofencesService.nombreComponente =  "LISTAR";

        let gNew = res1[2];

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


        console.log(geo);

        this.geofencesService.geofences.push(geo);



      });

    }
    // PUT|PATCH | api/zone/{zone}                         | zone.update                       | App\Http\Controllers\Api\V1\ZoneController@update
  }

  getCoordenadas(data:any){
    let coo = [];
    for (let i = 0; i < data.length; i++) {
      coo.push([data[i][1],data[i][0]]);
    };
    return coo;
  }

}
