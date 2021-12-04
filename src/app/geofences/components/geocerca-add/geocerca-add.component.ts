import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';

import { GeofencesService } from '../../services/geofences.service';

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
    public geofencesService: GeofencesService
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
    this.llenar_formulario();
  }

  llenar_formulario(){
    var geo = this.geofencesService.geofences.filter((item:any)=> item.id == this.geofencesService.idGeocercaEdit)[0];

    console.log(geo);

            // updatePerimeterAndArea(vm.polygon.getLatLngs());
    // console.log( "factorArea = "+factorArea );

    console.log( geo.geo_elemento.getLatLngs() );

    this.form.id = geo.id;
    this.form.nombre = geo.zone_name;
    this.form.descripcion = geo.descripcion;

    let perimetro = this.getPerimeter(geo.geo_elemento.getLatLngs()[0]) * this.measurementUnits[1].factor;
    this.form.perimetro = perimetro.toFixed(2);

    var factorArea = Math.pow(this.measurementUnits[1].factor, 2); //km2
    let area = this.geodesicArea(geo.geo_elemento.getLatLngs()[0]) * factorArea;
    this.form.area = area.toFixed(2);

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


    console.log(this.geodesicArea(geo.geo_elemento.getLatLngs()[0]));
    console.log(this.geodesicArea(geo.geo_elemento.getLatLngs()[0]) * factorArea);


    console.log(this.getPerimeter(geo.geo_elemento.getLatLngs()[0]));


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

  clickCancelar(){
    console.log("---clickCancelar");
    this.geofencesService.nombreComponente = "LISTAR";

  }

  clickGuardar(){
    console.log("---clickGuardar");
    console.log(this.form);

    this.geofencesService.edit(this.form).then( (res1) => {
      console.log("---clickGuardar----");
      console.log(res1);
      this.geofencesService.nombreComponente =  "LISTAR";

      let gEdit = res1[2];

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
      geo.zone_name_visible_bol = (geo.zone_name_visible === 'true');
      // geo.zone_vertices: "( -71.5331196784973 -16.40000880639486, -71.53320550918579 -16.400255801861498, -71.53292655944824 -16.400358724922672, -71.53284072875977 -16.40011170948444,-71.5331196784973 -16.40000880639486)"
      geo.zone_visible = gEdit.visible_zona;
      console.log(geo);





    });


    // this.historialService.get_tramas_recorrido(param).then( res => {




    // PUT|PATCH | api/zone/{zone}                         | zone.update                       | App\Http\Controllers\Api\V1\ZoneController@update
  }


}
