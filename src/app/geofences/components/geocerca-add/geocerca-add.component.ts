import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, OnDestroy } from '@angular/core';


import { GeofencesService } from '../../services/geofences.service';
// import { MeasureDrawService } from '../../services/measure-draw.service';


import { MapServicesService } from '../../../map/services/map-services.service';

import * as L from 'leaflet';

import 'leaflet-measure-path'
import 'leaflet-measure-path/leaflet-measure-path.css';

declare var $: any;
// import FreeDraw, { CREATE, EDIT } from 'leaflet-freedraw';
// import FreeDraw from 'leaflet-freedraw';


// import "leaflet-geometryutil";
// import "leaflet-pather";

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





export class GeocercaAddComponent implements OnInit, OnDestroy  {

  form :any = {};
  constructor(
    public geofencesService: GeofencesService,
    // public MeasureDrawService: MeasureDrawService,
    public mapService: MapServicesService,

  ) { }

  action:string = "add";
  poligonAdd:any;

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
      var geo = this.geofencesService.geofences.filter((item:any)=> item.id == this.geofencesService.idGeocercaEdit)[0];
      console.log(geo);

      if (geo.zone_visible == "true") {
        // geo.geo_elemento.geo_elemento.addTo(this.mapService.map);
      } else {
        geo.geo_elemento.addTo(this.mapService.map);
        // this.mapService.map.removeLayer(geo.geo_elemento);
      }

    } else {
      this.nuevo_formulario();

      // var drawControl = new L.Draw.Polygon(this.mapService.map);
      // drawControl.enable();




      // Initialise the FeatureGroup to store editable layers
      // var editableLayers = new L.FeatureGroup();
      // this.mapService.map.addLayer(editableLayers);

      // var drawPluginOptions = {
      //   position: 'topright',
      //   draw: {
      //     polygon: {
      //       allowIntersection: false, // Restricts shapes to simple polygons
      //       drawError: {
      //         color: '#e1e100', // Color the shape will turn when intersects
      //         message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
      //       },
      //       shapeOptions: {
      //         color: '#97009c'
      //       }
      //     },
      //     // disable toolbar item by setting it to false
      //     polyline: false,
      //     circle: false, // Turns off this drawing tool
      //     rectangle: false,
      //     marker: false,
      //     },
      //   edit: {
      //     featureGroup: editableLayers, //REQUIRED!!
      //     remove: false
      //   }
      // };


      // new L.Draw.Polyline(this.mapService.map, {drawControl.options.polyline}).enable();

      // const draw = new MeasureDrawService();
      // console.log(MeasureDrawService.name);
      // var poligono = this.MeasureDrawService.createPolygon();
      // console.log(poligono);

      // this.mapService.map.getCenter()
      console.log('center');
      console.log(this.mapService.map.getCenter());

      console.log(this.mapService.map.getCenter().lat);

      var centro = [this.mapService.map.getCenter().lat , this.mapService.map.getCenter().lng];

      var ne = [this.mapService.map.getBounds().getNorthEast().lat, this.mapService.map.getBounds().getNorthEast().lng];
      var no = [this.mapService.map.getBounds().getNorthWest().lat, this.mapService.map.getBounds().getNorthWest().lng];

      var se = [this.mapService.map.getBounds().getSouthEast().lat, this.mapService.map.getBounds().getSouthEast().lng];
      var so = [this.mapService.map.getBounds().getSouthWest().lat, this.mapService.map.getBounds().getSouthWest().lng];


      console.log(this.mapService.map.getBounds());

      console.log(this.mapService.map.getBounds().getNorthEast());
      console.log(this.mapService.map.getBounds().getNorthWest());
      console.log(this.mapService.map.getBounds().getSouthEast());
      console.log(this.mapService.map.getBounds().getSouthWest());

      // console.log(this.mapService.map.getBounds().getNorthEast().lat);
      // console.log(this.mapService.map.getBounds().getNorthWest().lng);
      // console.log(this.mapService.map.getBounds().getSouthEast());
      // console.log(this.mapService.map.getBounds().getSouthWest());


      console.log(this.getLatLngCenter([ [2,2] ,[5,5]]));
      console.log(this.getLatLngCenter([ ne ,centro ]));
      var ng1 = [this.getLatLngCenter([ ne ,centro ])[0] , this.getLatLngCenter([ ne ,centro ])[1]];
      console.log(ne);
      console.log(centro);

      this.poligonAdd = new L.Polygon( [
        [this.getLatLngCenter([ ne ,centro ])[0],this.getLatLngCenter([ ne ,centro ])[1]],
        [this.getLatLngCenter([ no ,centro ])[0],this.getLatLngCenter([ no ,centro ])[1]],
        [this.getLatLngCenter([ so ,centro ])[0],this.getLatLngCenter([ so ,centro ])[1]],
        [this.getLatLngCenter([ se ,centro ])[0],this.getLatLngCenter([ se ,centro ])[1]],
      ], {
        weight: 3,
        fill: true,
        color: '#000000'
      }).addTo(this.mapService.map);

      this.poligonAdd.editing.enable();

    }
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

    console.log('SALDRE DE LA EDICION DE GEOCERCA');
    if ( this.geofencesService.action == "edit" ) {
    } else {
      this.mapService.map.removeLayer(this.poligonAdd);
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
    this.form.categoria = 0;

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
        });//.addTo(this.mapService.map);

        if (geo.zone_visible == "true") {
          geo.geo_elemento.addTo(this.mapService.map);
        }


    } else {
      console.log("CREACION DE GEOCERCA");
      this.mapService.map.removeLayer(this.poligonAdd);
    }


    //geo.geo_elemento.setLatLngs( this.getCoordenadas( JSON.parse(geo.geo_coordenadas).coordinates[0] ));
  }

  clickGuardar(id:number){
    console.log("---clickGuardar");

    if ( this.geofencesService.action == "edit" ) {

      var geo0 = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];
      this.form.geo_geometry = this.layerToPoints(geo0.geo_elemento,'POLYGON');

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
        });//.addTo(this.mapService.map);


        if (geo.zone_visible == "true") {
          geo.geo_elemento.addTo(this.mapService.map);
        }

        //================= nombre de la geocerca
        var centerPoligon = geo.geo_elemento.getBounds().getCenter();

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
            '<b class="" style="-webkit-text-stroke: 0.5px black; color: '+geo.zone_color+';">'+geo.zone_name+'</b>',
            { permanent: true,
              // offset: [-100, 0],
              direction: 'center',
              className: 'leaflet-tooltip-own',
            });


        if (geo.zone_name_visible == "true") {
          geo.marker_name.addTo(this.mapService.map);
        }



        // geo.geo_elemento.setLatLngs( this.getCoordenadas( JSON.parse(geo.geo_coordenadas).coordinates[0] ));
        // geo.zone_vertices: "( -71.5331196784973 -16.40000880639486, -71.53320550918579 -16.400255801861498, -71.53292655944824 -16.400358724922672, -71.53284072875977 -16.40011170948444,-71.5331196784973 -16.40000880639486)"
        // console.log('<<<<<latlngs');
        // console.log(geo);
      });

    } else {

      this.form.geo_geometry = this.layerToPoints(this.poligonAdd,'POLYGON');

      this.geofencesService.store(this.form).then( (res1) => {
        console.log("---clickGuardar NUEVO----");
        console.log(res1);

        this.geofencesService.nombreComponente =  "LISTAR";

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

        geo.geo_coordenadas = gNew2.geo_coordenadas;

        console.log(geo);

        this.mapService.map.removeLayer(this.poligonAdd);
        geo.geo_elemento = new L.Polygon( this.getCoordenadas( JSON.parse(gNew2.geo_coordenadas).coordinates[0] ), {
          weight: 3,
          fill: true,
          color: geo.zone_color //'#000000'
        }).addTo(this.mapService.map);

        this.geofencesService.geofences.push(geo);

      });
    }

    //Despues de agregar o editar, ordena el array de geocercas por el atributo orden(nombre de la geocerca en mayuscula)
    this.geofencesService.geofences.sort(function (a:any, b:any){
      return a.orden.localeCompare(b.orden, 'en', { numeric: true })
    });

    // PUT|PATCH | api/zone/{zone}                         | zone.update                       | App\Http\Controllers\Api\V1\ZoneController@update
  }

  changeGeoColor(id:number) {

    let newColor = this.form.color;

    if ( this.geofencesService.action == "edit" ) {
        var geo = this.geofencesService.geofences.filter((item:any)=> item.id == id)[0];
        geo.geo_elemento.setStyle({opacity: 1, color: newColor });

    } else {
        // console.log("CREACION DE GEOCERCA");
        this.poligonAdd.setStyle({opacity: 1, color: newColor });
    }

  }

  getCoordenadas(data:any){
    let coo = [];
    for (let i = 0; i < data.length; i++) {
      coo.push([data[i][1],data[i][0]]);
    };
    return coo;
  }

}


