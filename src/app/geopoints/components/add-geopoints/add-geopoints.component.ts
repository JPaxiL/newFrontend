import { Component, OnInit, OnDestroy } from '@angular/core';

import { GeopointsService } from '../../services/geopoints.service';
import { MapServicesService } from '../../../map/services/map-services.service';

import * as L from 'leaflet';
import { Logger } from 'ag-grid-community';

@Component({
  selector: 'app-add-geopoints',
  templateUrl: './add-geopoints.component.html',
  styleUrls: ['./add-geopoints.component.scss']
})
export class AddGeopointsComponent implements OnInit, OnDestroy {

  form :any = {};
  chkMostrarGeopunto: boolean = true;
  chkMostrarNombre: boolean = true;

  constructor(
    public geopointsService: GeopointsService,
    public mapService: MapServicesService,
  ) { }

  action:string = "add";
  pointAdd:any;

  ngOnInit(): void {
    console.log(this.geopointsService.action + "action");

    if ( this.geopointsService.action == "edit" ) {
      this.llenar_formulario();
      var geo = this.geopointsService.geopoints.filter((item:any)=> item.geopunto_id == this.geopointsService.idGeopointEdit)[0];
      // console.log(geo);

      this.mapService.map.fitBounds([geo.geo_elemento.getLatLng()], {
        padding: [50, 50]
      });


      if (geo.geopunto_visible == "true") {
        // geo.geo_elemento.geo_elemento.addTo(this.mapService.map);
      } else {
        geo.geo_elemento.addTo(this.mapService.map);
        // this.mapService.map.removeLayer(geo.geo_elemento);
      }

    } else {
      this.nuevo_formulario();

      // console.log('center');
      // console.log(this.mapService.map.getCenter());

      // console.log(this.mapService.map.getCenter().lat);

      // var centro = [this.mapService.map.getCenter().lat , this.mapService.map.getCenter().lng];

      // var ne = [this.mapService.map.getBounds().getNorthEast().lat, this.mapService.map.getBounds().getNorthEast().lng];
      // var no = [this.mapService.map.getBounds().getNorthWest().lat, this.mapService.map.getBounds().getNorthWest().lng];

      // var se = [this.mapService.map.getBounds().getSouthEast().lat, this.mapService.map.getBounds().getSouthEast().lng];
      // var so = [this.mapService.map.getBounds().getSouthWest().lat, this.mapService.map.getBounds().getSouthWest().lng];


      // console.log(this.mapService.map.getBounds());


      // console.log(this.getLatLngCenter([ [2,2] ,[5,5]]));
      // console.log(this.getLatLngCenter([ ne ,centro ]));
      // var ng1 = [this.getLatLngCenter([ ne ,centro ])[0] , this.getLatLngCenter([ ne ,centro ])[1]];
      // console.log(ne);
      // console.log(centro);

      // this.poligonAdd = new L.Polygon( [
      //   [this.getLatLngCenter([ ne ,centro ])[0],this.getLatLngCenter([ ne ,centro ])[1]],
      //   [this.getLatLngCenter([ no ,centro ])[0],this.getLatLngCenter([ no ,centro ])[1]],
      //   [this.getLatLngCenter([ so ,centro ])[0],this.getLatLngCenter([ so ,centro ])[1]],
      //   [this.getLatLngCenter([ se ,centro ])[0],this.getLatLngCenter([ se ,centro ])[1]],
      // ], {
      //   weight: 3,
      //   fill: true,
      //   color: '#000000'
      // }).addTo(this.mapService.map);

      // this.poligonAdd.editing.enable();


      const svgIcon = L.divIcon({
        html: `<svg version="1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 149 178"><path fill="#F00" stroke="#2BFF00" stroke-width="8" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#2BFF00" cx="74" cy="75" r="30"/></svg>`,
        className: "",
        iconSize: [24, 29],
        iconAnchor: [12, 29],
      });

      this.pointAdd = L.marker([this.mapService.map.getCenter().lat , this.mapService.map.getCenter().lng],
      { icon: svgIcon
      }).addTo(this.mapService.map);

      this.pointAdd.dragging.enable();

    }

  }

  ngOnDestroy(){

    //console.log('SALDRE DE LA EDICION DE GEOCERCA');
    if ( this.geopointsService.action == "edit" ) {

        var geo = this.geopointsService.geopoints.filter((item:any)=> item.geopunto_id == this.geopointsService.idGeopointEdit)[0];
        this.mapService.map.removeLayer(geo.geo_elemento);

        var latlng = geo.geopunto_vertices.split(",")
        const svgIcon = L.divIcon({
            // html: `<svg version="1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 149 178"><path fill="`+geo.geopunto_color+`" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#FFF" cx="74" cy="75" r="24"/></svg>`,
            html: this.geopointsService.geopointHTMLMarkerIcon(geo.geopunto_color),
            className: "",
            iconSize: [24, 29],
            iconAnchor: [12, 29],
          });

        geo.geo_elemento = L.marker([parseFloat(latlng[0]), parseFloat(latlng[1])],
            { icon: svgIcon
            });

        if (geo.geopunto_visible == "true") {
            geo.geo_elemento.addTo(this.mapService.map);
        }

    } else {
        this.mapService.map.removeLayer(this.pointAdd);
    }

  }

  llenar_formulario(){
    var geo = this.geopointsService.geopoints.filter((item:any)=> item.geopunto_id == this.geopointsService.idGeopointEdit)[0];

    console.log(geo);

    //Si el icono no esta en el mapa lo pone visible
    if (geo.geopunto_visible == "false") {
      geo.geo_elemento.addTo(this.mapService.map);
    }

    const svgIcon = L.divIcon({
      html: `<svg version="1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 149 178"><path fill="`+geo.geopunto_color+`" stroke="#2BFF00" stroke-width="8" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#2BFF00" cx="74" cy="75" r="30"/></svg>`,
      className: "",
      iconSize: [24, 29],
      iconAnchor: [12, 29],
    });

    geo.geo_elemento.setIcon(svgIcon);


    geo.geo_elemento.dragging.enable();

    // marker.dragging.disable();
    // marker.dragging.enable();

    this.form.geopunto_id = geo.geopunto_id;
    this.form.geopunto_name = geo.geopunto_name;


    this.form.geopunto_color = geo.geopunto_color;//"#FFEE00";

    this.form.geopunto_visible_bol           = geo.geopunto_visible_bol;
    this.form.geopunto_nombre_visible_bol    = geo.geopunto_nombre_visible_bol;

    this.form.geopunto_vertices          = geo.geopunto_vertices;

  }

  nuevo_formulario(){

    this.form.geopunto_id = 0;
    this.form.geopunto_name = '';

    this.form.geopunto_color = "#ff0000";

    this.form.geopunto_visible         = "true";
    this.form.geopunto_nombre_visible  = "true";
    this.form.geopunto_visible_bol           = true;
    this.form.geopunto_nombre_visible_bol    = true;

    this.form.geopunto_vertices        = "";

  }

  clickCancelar(id:number){
    console.log("---clickCancelar");

    this.geopointsService.nombreComponente = "LISTAR";

    var geo = this.geopointsService.geopoints.filter((item:any)=> item.geopunto_id == id)[0];
    if ( this.geopointsService.action == "edit" ) {

        this.mapService.map.removeLayer(geo.geo_elemento);

        var latlng = geo.geopunto_vertices.split(",")
        const svgIcon = L.divIcon({
            // html: `<svg version="1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 149 178"><path fill="`+geo.geopunto_color+`" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#FFF" cx="74" cy="75" r="24"/></svg>`,
            html: this.geopointsService.geopointHTMLMarkerIcon(geo.geopunto_color),
            className: "",
            iconSize: [24, 29],
            iconAnchor: [12, 29],
          });

        geo.geo_elemento = L.marker([parseFloat(latlng[0]), parseFloat(latlng[1])],
            { icon: svgIcon
            });

        if (geo.geopunto_visible == "true") {
            geo.geo_elemento.addTo(this.mapService.map);
        }

    } else {
        console.log("CREACION DE GEOCERCA");
        this.mapService.map.removeLayer(this.pointAdd);
    }


  }

  clickGuardar(id:number){
    console.log("---clickGuardar");
    console.log(this.geopointsService.action);


    if ( this.geopointsService.action == "edit" ) {

      var geo0 = this.geopointsService.geopoints.filter((item:any)=> item.geopunto_id == id)[0];

      //console.log(geo0);

      this.form.geopunto_nombre_visible = (this.form.geopunto_nombre_visible_bol) ? "true"  : "false";
      this.form.geopunto_visible    = (this.form.geopunto_visible_bol) ? "true"  : "false";

      this.form.geopunto_vertices = this.layerToPoints(geo0.geo_elemento,'POINT');

      this.geopointsService.edit(this.form).then( (res1) => {
        console.log("---clickGuardar----");
        console.log(res1);
        this.geopointsService.nombreComponente =  "LISTAR";


        let gEdit = res1[2];
        let gEdit2 = res1[3][0];

        var geo = this.geopointsService.geopoints.filter((item:any)=> item.geopunto_id == gEdit.id)[0];


        geo.geo_elemento.dragging.disable();
        //geo.geo_elemento.editing.disable();

        // color_punto: "#00ff59"
        // coordenadas_punto: "-13.57600000,-71.99536667"
        // id: 65
        // nombre_punto: "06asd"
        // nombre_visible_punto: "0"
        // usuario_id: 305
        // visible_punto: false

        geo.geopunto_color          = gEdit2.geopunto_color;
        geo.geopunto_name           = gEdit2.geopunto_name;
        geo.geopunto_nombre_visible = gEdit2.geopunto_nombre_visible;
        geo.geopunto_nombre_visible_bol = (geo.geopunto_nombre_visible === 'true');
        geo.geopunto_visible        = gEdit2.geopunto_visible;
        geo.geopunto_visible_bol    = (geo.geopunto_visible === 'true');

        geo.geopunto_vertices = gEdit2.geopunto_vertices;

        this.mapService.map.removeLayer(geo.geo_elemento);
        this.mapService.map.removeLayer(geo.marker_name);

        // //XXXXXXXXXXXXX=======================================

        var latlng = geo.geopunto_vertices.split(",")

        const svgIcon = L.divIcon({
            // html: `<svg version="1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 149 178"><path fill="`+geo.geopunto_color+`" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#FFF" cx="74" cy="75" r="24"/></svg>`,
            html: this.geopointsService.geopointHTMLMarkerIcon(geo.geopunto_color),
            className: "",
            iconSize: [24, 29],
            iconAnchor: [12, 29],
          });

        geo.geo_elemento = L.marker([parseFloat(latlng[0]), parseFloat(latlng[1])],
            { icon: svgIcon
            });

        if (geo.geopunto_visible == "true") {
            geo.geo_elemento.addTo(this.mapService.map);
        }

        geo.marker_name = L.circleMarker([parseFloat(latlng[0]), parseFloat(latlng[1])], {
            // pane: 'markers1',
            "radius": 0,
            "fillColor": "#000",//color,
            "fillOpacity": 1,
            "color": "#000",//color,
            "weight": 1,
            "opacity": 1

          }).bindTooltip(
              // "<div style='background:blue;'><b>" + this.geofences[i].zone_name+ "</b></div>",//,
              '<b class="" style="-webkit-text-stroke: 0.5px black; color: '+geo.geopunto_color+';">'+geo.geopunto_name+'</b>',
              { permanent: true,
                offset: [20, 20],
                direction: 'center',
                className: 'leaflet-tooltip-own',
              });

        if (geo.geopunto_nombre_visible == "true") {
          geo.marker_name.addTo(this.mapService.map);
        }


      });

    } else {

      // this.form.geo_geometry = this.layerToPoints(this.poligonAdd,'POLYGON');

      this.form.geopunto_nombre_visible = (this.form.geopunto_nombre_visible_bol) ? "true"  : "false";
      this.form.geopunto_visible    = (this.form.geopunto_visible_bol) ? "true"  : "false";

      this.form.geopunto_vertices = this.layerToPoints(this.pointAdd,'POINT');

      this.geopointsService.store(this.form).then( (res1) => {
        console.log("---clickGuardar NUEVO----");
        console.log(res1);

        this.geopointsService.nombreComponente =  "LISTAR";

        let gNew = res1[2];
        // let gNew2 = res1[3][0];
        // var geo = this.geofencesService.geofences.filter((item:any)=> item.id == gEdit.id)[0];



        var geo:any = {};
        geo.geopunto_id       = gNew.id;
        geo.geopunto_color    = gNew.color_punto;
        geo.geopunto_name     = gNew.nombre_punto;
        geo.geopunto_nombre_visible = gNew.nombre_visible_punto;
        geo.geopunto_nombre_visible_bol = (geo.geopunto_nombre_visible === 'true');

        geo.geopunto_visible  = gNew.visible_punto;
        geo.geopunto_visible_bol = (geo.geopunto_visible === 'true');

        geo.geopunto_vertices = gNew.coordenadas_punto;
        geo.user_id           = gNew.usuario_id;

        this.mapService.map.removeLayer(this.pointAdd);


          // ==============2

          var latlng = geo.geopunto_vertices.split(",")

          const svgIcon = L.divIcon({
            // html: `<svg version="1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 149 178"><path fill="`+geo.geopunto_color+`" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#FFF" cx="74" cy="75" r="24"/></svg>`,
            html: this.geopointsService.geopointHTMLMarkerIcon(geo.geopunto_color),
            className: "",
            iconSize: [24, 29],
            iconAnchor: [12, 29],
          });

          geo.geo_elemento = L.marker([parseFloat(latlng[0]), parseFloat(latlng[1])],
            { icon: svgIcon
            });

          if (geo.geopunto_visible == "true") {
            geo.geo_elemento.addTo(this.mapService.map);
          }

          geo.marker_name = L.circleMarker([parseFloat(latlng[0]), parseFloat(latlng[1])], {
            // pane: 'markers1',
            "radius": 0,
            "fillColor": "#000",//color,
            "fillOpacity": 1,
            "color": "#000",//color,
            "weight": 1,
            "opacity": 1

          }).bindTooltip(
              // "<div style='background:blue;'><b>" + this.geofences[i].zone_name+ "</b></div>",//,
              // '<b class="" style="-webkit-text-stroke: 0.5px black; color: '+geo.geopunto_color+';">'+geo.geopunto_name+'</b>',
              '<b class="" style="border: 0.2rem solid #000; background-color: '+ this.mapService.hexToRGBA(geo.geopunto_color) +'; color: '+ this.mapService.getContrastYIQ(geo.geopunto_color) +';">'+geo.geopunto_name+'</b>',
              { permanent: true,
                offset: [20, 20],
                direction: 'center',
                className: 'leaflet-tooltip-own',
              });

        if (geo.geopunto_nombre_visible == "true") {
          geo.marker_name.addTo(this.mapService.map);
        }

          // ===== 2

        this.geopointsService.geopoints.push(geo);

        // geopunto_color: "#000000"
        // geopunto_id: 8556
        // geopunto_name: "Ilo"
        // geopunto_nombre_visible: "true"
        // geopunto_nombre_visible_bol: true
        // geopunto_vertices: "-17.649256706812025,-71.34899139404297"
        // geopunto_visible: "true"
        // geopunto_visible_bol: true


        // color_punto: "#04ff00"
        // coordenadas_punto: "-16.230255203755007,-73.69171656668186"
        // id: 14278
        // nombre_punto: "prueba 2"
        // nombre_visible_punto: "true"
        // usuario_id: 117
        // visible_punto: "true"


        // geo.descripcion = gNew.descripcion;
        // geo.orden = gNew.nombre_zona;
        // geo.vel2_zona = gNew.vel2_zona;
        // geo.vel3_zona = gNew.vel3_zona;
        // geo.vel_act_zona = gNew.vel_act_zona;
        // geo.vel_max = gNew.vel_max;
        // geo.vel_zona = gNew.vel_zona;
        // geo.zone_cat = gNew.categoria_zona;
        // geo.zone_color = gNew.color_zona;
        // geo.zone_name = gNew.nombre_zona;
        // geo.zone_name_visible = gNew.nombre_visible_zona;
        // geo.zone_name_visible_bol = (geo.zone_name_visible === 'true');
        // // geo.zone_vertices: "( -71.5331196784973 -16.40000880639486, -71.53320550918579 -16.400255801861498, -71.53292655944824 -16.400358724922672, -71.53284072875977 -16.40011170948444,-71.5331196784973 -16.40000880639486)"
        // geo.zone_visible = gNew.visible_zona;

        // geo.geo_coordenadas = gNew2.geo_coordenadas;

        // console.log(geo);

        // this.mapService.map.removeLayer(this.poligonAdd);
        // geo.geo_elemento = new L.Polygon( this.getCoordenadas( JSON.parse(gNew2.geo_coordenadas).coordinates[0] ), {
        //   weight: 3,
        //   fill: true,
        //   color: geo.zone_color //'#000000'
        // }).addTo(this.mapService.map);

        // this.geofencesService.geofences.push(geo);

      });
    }

    //Despues de agregar o editar, ordena el array de geocercas por el atributo geopunto_name(nombre de la geocerca en mayuscula)
    // this.geopointsService.geopoints.sort(function (a:any, b:any){
    //   return a.geopunto_name.localeCompare(b.geopunto_name, 'en', { numeric: true })
    // });
    // console.log("111");

    // console.log(this.geopointsService.geopoints);

    // this.geopointsService.geopoints = this.geopointsService.geopoints.sort(this.SortArray);
    // console.log("2222");

    // console.log(this.geopointsService.geopoints);

  }

  // SortArray(x:any, y:any){
  //   return x.geopunto_name.localeCompare(y.geopunto_name, 'en', {sensitivity: 'base'});
  // }


  layerToPoints(figure:any, type:string) {
    var geoElement = '';

    switch (type) {
      case 'POINT':
        // var latlngs = figure.getLatLngs();
        // console.log(figure);
        // console.log(figure.getLatLng());

        // var latlng = figure.getLatLng();
        // console.log(figure.getLatLng().lat);
        // console.log(figure.getLatLng().lng);

        geoElement = figure.getLatLng().lat+","+figure.getLatLng().lng;


        break;
    }
    console.log(geoElement);

    return geoElement;

   }


  changeGeoColor(id:number) {

    let newColor = this.form.geopunto_color;

    console.log(newColor);

    if ( this.geopointsService.action == "edit" ) {
        var geo = this.geopointsService.geopoints.filter((item:any)=> item.geopunto_id == id)[0];

        // geo.geo_elemento.setStyle({opacity: 1, color: newColor });

        const svgIcon = L.divIcon({
          html: `<svg version="1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 149 178"><path fill="`+newColor+`" stroke="#2BFF00" stroke-width="8" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#2BFF00" cx="74" cy="75" r="30"/></svg>`,
          className: "",
          iconSize: [24, 29],
          iconAnchor: [12, 29],
        });

        geo.geo_elemento.setIcon(svgIcon);



    } else {
        // console.log("CREACION DE GEOCERCA");
        //this.poligonAdd.setStyle({opacity: 1, color: newColor });
        const svgIcon = L.divIcon({
          html: `<svg version="1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 149 178"><path fill="`+newColor+`" stroke="#2BFF00" stroke-width="8" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#2BFF00" cx="74" cy="75" r="30"/></svg>`,
          className: "",
          iconSize: [24, 29],
          iconAnchor: [12, 29],
        });

        this.pointAdd.setIcon(svgIcon);

    }

  }


}
