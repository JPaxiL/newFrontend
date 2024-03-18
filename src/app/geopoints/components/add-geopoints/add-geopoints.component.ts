import { Component, OnInit, OnDestroy } from '@angular/core';

import Swal from 'sweetalert2';
import { GeopointsService } from '../../services/geopoints.service';
import { MapServicesService } from '../../../map/services/map-services.service';

import * as L from 'leaflet';
import { Logger } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-geopoints',
  templateUrl: './add-geopoints.component.html',
  styleUrls: ['./add-geopoints.component.scss'],
})
export class AddGeopointsComponent implements OnInit, OnDestroy {
  form: any = {};
  chkMostrarGeopunto: boolean = true;
  chkMostrarNombre: boolean = true;

  constructor(
    public geopointsService: GeopointsService,
    public mapService: MapServicesService,
    private spinner: NgxSpinnerService
  ) {}

  action: string = 'add';
  pointAdd: any;

  ngOnInit(): void {
    console.log(this.geopointsService.action + 'action');

    if (this.geopointsService.action == 'edit') {
      this.llenar_formulario();
      var geo = this.geopointsService.geopoints.filter(
        (item: any) => item.geopunto_id == this.geopointsService.idGeopointEdit
      )[0];
      console.log("filtro de feo",geo);

      this.mapService.map.fitBounds([geo.geo_elemento.getLatLng()], {
        padding: [50, 50],
      });

      /* const popupContent = `<b>Latitud:</b> ${geo.geo_elemento.getLatLng().lat}<br><b>Longitud:</b> ${geo.geo_elemento.getLatLng().lng}`;

      geo.geo_elemento.bindPopup(popupContent, { offset: [0, -20] }); */


      //COORDENADA DINAMICA
     /*  geo.geo_elemento.on('dragend', function (event: any) {
        var marker = event.target; 
        var position = marker.getLatLng(); 
        var lat = position.lat;
        var lng = position.lng; 
        marker.setPopupContent(
          '<span>Latitud: ' + lat + '<br>Longitud: ' + lng + '</span>'
        );
      });  */

      
      
      if (geo.geopunto_visible == 'true') {
      } else {
        geo.geo_elemento.addTo(this.mapService.map);
      }

      
    } else {
      this.nuevo_formulario();

      const svgIcon = L.divIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 34.892"><g transform="matrix(1.18559 0 0 1.18559 -965.773 -331.784)"><path d="M817.112 282.971c-1.258 1.343-2.046 3.299-2.015 5.139.064 3.845 1.797 5.3 4.568 10.592.999 2.328 2.04 4.792 3.031 8.873.138.602.272 1.16.335 1.21.062.048.196-.513.334-1.115.99-4.081 2.033-6.543 3.031-8.871 2.771-5.292 4.504-6.748 4.568-10.592.031-1.84-.759-3.798-2.017-5.14-1.437-1.535-3.605-2.67-5.916-2.717-2.312-.048-4.481 1.087-5.919 2.621z" style="fill:#f00;"/><circle r="3.035" cy="288.253" cx="823.031" style="fill:#2BFF00"/></g></svg>`,
        className: '',
        iconSize: [24, 41.86],
        iconAnchor: [12, 41.86],
      });

      /* var popupText =
        '<span>Latitud: ' +
        this.mapService.map.getCenter().lat +
        '<br>Longitud: ' +
        this.mapService.map.getCenter().lng +
        '</span>';  */
      
      this.pointAdd = L.marker(
        [
          this.mapService.map.getCenter().lat,
          this.mapService.map.getCenter().lng,
        ],
        {
          icon: svgIcon,
        }
      )/* .bindPopup(popupText, { offset: [0, -20] }) */.addTo(this.mapService.map);


        //COORDENADA DINAMICA
     /*  this.pointAdd.on('dragend', function (event: any) {
        var marker = event.target; 
        var position = marker.getLatLng(); 
        var lat = position.lat;
        var lng = position.lng; 
        marker.setPopupContent(
          '<span>Latitud: ' + lat + '<br>Longitud: ' + lng + '</span>'
        );
      });  */

      this.pointAdd.dragging.enable();
    }
  }

  ngOnDestroy() {
    //console.log('SALDRE DE LA EDICION DE GEOCERCA');
    if (this.geopointsService.action == 'edit') {
      var geo = this.geopointsService.geopoints.filter(
        (item: any) => item.geopunto_id == this.geopointsService.idGeopointEdit
      )[0];
      this.mapService.map.removeLayer(geo.geo_elemento);

      var latlng = geo.geopunto_vertices.split(',');
      const svgIcon = L.divIcon({
        // html: `<svg version="1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 149 178"><path fill="`+geo.geopunto_color+`" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#FFF" cx="74" cy="75" r="24"/></svg>`,
        html: this.geopointsService.geopointHTMLMarkerIcon(geo.geopunto_color),
        className: '',
        iconSize: [24, 41.86],
        iconAnchor: [12, 41.86],
      });

      var popupText =
        '<span>Latitud: ' +
        this.mapService.map.getCenter().lat +
        '<br>Longitud: ' +
        this.mapService.map.getCenter().lng +
        '</span>'; 

      geo.geo_elemento = L.marker(
        [parseFloat(latlng[0]), parseFloat(latlng[1])],
        { icon: svgIcon }
      ).bindPopup(popupText, { offset: [0, -20] }).addTo(this.mapService.map);

      if (geo.geopunto_visible == 'true') {
        geo.geo_elemento.addTo(this.mapService.map);
      }
    } else {
      this.mapService.map.removeLayer(this.pointAdd);
    }
  }

  llenar_formulario() {
    var geo = this.geopointsService.geopoints.filter(
      (item: any) => item.geopunto_id == this.geopointsService.idGeopointEdit
    )[0];

    console.log(geo);

    //Si el icono no esta en el mapa lo pone visible
    if (geo.geopunto_visible == 'false') {
      geo.geo_elemento.addTo(this.mapService.map);
    }

    const svgIcon = L.divIcon({
      //html: `<svg version="1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 149 178"><path fill="`+geo.geopunto_color+`" stroke="#2BFF00" stroke-width="8" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#2BFF00" cx="74" cy="75" r="30"/></svg>`,
      html:
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 34.892"><g transform="matrix(1.18559 0 0 1.18559 -965.773 -331.784)"><path d="M817.112 282.971c-1.258 1.343-2.046 3.299-2.015 5.139.064 3.845 1.797 5.3 4.568 10.592.999 2.328 2.04 4.792 3.031 8.873.138.602.272 1.16.335 1.21.062.048.196-.513.334-1.115.99-4.081 2.033-6.543 3.031-8.871 2.771-5.292 4.504-6.748 4.568-10.592.031-1.84-.759-3.798-2.017-5.14-1.437-1.535-3.605-2.67-5.916-2.717-2.312-.048-4.481 1.087-5.919 2.621z" style="fill:` +
        geo.geopunto_color +
        `;"/><circle r="3.035" cy="288.253" cx="823.031" style="fill:#fff"/></g></svg>`,
      className: '',
      iconSize: [24, 41.86],
      iconAnchor: [12, 41.86],
    });

    geo.geo_elemento.setIcon(svgIcon);

    geo.geo_elemento.dragging.enable();

    // marker.dragging.disable();
    // marker.dragging.enable();

    this.form.geopunto_id = geo.geopunto_id;
    this.form.geopunto_name = geo.geopunto_name;

    this.form.geopunto_color = geo.geopunto_color; //"#FFEE00";

    this.form.geopunto_visible_bol = geo.geopunto_visible_bol;
    this.form.geopunto_nombre_visible_bol = geo.geopunto_nombre_visible_bol;

    this.form.geopunto_vertices = geo.geopunto_vertices;
  }

  nuevo_formulario() {
    this.form.geopunto_id = 0;
    this.form.geopunto_name = '';

    this.form.geopunto_color = '#ff0000';

    this.form.geopunto_visible = 'true';
    this.form.geopunto_nombre_visible = 'true';
    this.form.geopunto_visible_bol = true;
    this.form.geopunto_nombre_visible_bol = true;

    this.form.geopunto_vertices = '';
  }

  clickCancelar(id: number) {
    console.log('---clickCancelar');

    this.geopointsService.nombreComponente = 'LISTAR';

    var geo = this.geopointsService.geopoints.filter(
      (item: any) => item.geopunto_id == id
    )[0];
    if (this.geopointsService.action == 'edit') {
      this.mapService.map.removeLayer(geo.geo_elemento);

      var latlng = geo.geopunto_vertices.split(',');
      const svgIcon = L.divIcon({
        // html: `<svg version="1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 149 178"><path fill="`+geo.geopunto_color+`" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#FFF" cx="74" cy="75" r="24"/></svg>`,
        html: this.geopointsService.geopointHTMLMarkerIcon(geo.geopunto_color),
        className: '',
        iconSize: [24, 41.86],
        iconAnchor: [12, 41.86],
      });

      geo.geo_elemento = L.marker(
        [parseFloat(latlng[0]), parseFloat(latlng[1])],
        { icon: svgIcon }
      );

      if (geo.geopunto_visible == 'true') {
        geo.geo_elemento.addTo(this.mapService.map);
      }
    } else {
      console.log('CREACION DE GEOCERCA');
      this.mapService.map.removeLayer(this.pointAdd);
    }
  }

  clickGuardar(id: number) {
    if (
      this.form.geopunto_name == null ||
      this.form.geopunto_name.trim() == '' ||
      this.form.geopunto_name.trim().length == 0
    ) {
      Swal.fire({
        title: 'Error',
        text: 'El nombre del geopunto no puede quedar vacío.',
        icon: 'warning',
      });
      return;
    }

    


    console.log('---clickGuardar');
    console.log("accion",this.geopointsService.action);
    this.spinner.show('spinnerLoading');

    if (this.geopointsService.action == 'edit') {
      var geo0 = this.geopointsService.geopoints.filter(
        (item: any) => item.geopunto_id == id
      )[0];
      geo0.geo_elemento.dragging.disable();

      //console.log(geo0);

      this.form.geopunto_nombre_visible = this.form.geopunto_nombre_visible_bol
        ? 'true'
        : 'false';
      this.form.geopunto_visible = this.form.geopunto_visible_bol
        ? 'true'
        : 'false';

      this.form.geopunto_vertices = this.layerToPoints(
        geo0.geo_elemento,
        'POINT'
      );

      this.geopointsService.edit(this.form).then((res1) => {
        
        console.log('---clickGuardar----');
        console.log(res1);
        this.geopointsService.nombreComponente = 'LISTAR';

        let gEdit = res1[2];
        let gEdit2 = res1[3][0];

        var geo = this.geopointsService.geopoints.filter(
          (item: any) => item.geopunto_id == gEdit.id
        )[0];

        //geo.geo_elemento.editing.disable();

        // color_punto: "#00ff59"
        // coordenadas_punto: "-13.57600000,-71.99536667"
        // id: 65
        // nombre_punto: "06asd"
        // nombre_visible_punto: "0"
        // usuario_id: 305
        // visible_punto: false

        geo.geopunto_color = gEdit2.geopunto_color;
        geo.geopunto_name = gEdit2.geopunto_name;
        geo.geopunto_nombre_visible = gEdit2.geopunto_nombre_visible;
        geo.geopunto_nombre_visible_bol =
          geo.geopunto_nombre_visible === 'true';
        geo.geopunto_visible = gEdit2.geopunto_visible;
        geo.geopunto_visible_bol = geo.geopunto_visible === 'true';

        geo.geopunto_vertices = gEdit2.geopunto_vertices;

        this.mapService.map.removeLayer(geo.geo_elemento);
        this.mapService.map.removeLayer(geo.marker_name);

        // //XXXXXXXXXXXXX=======================================

        var latlng = geo.geopunto_vertices.split(',');

        const svgIcon = L.divIcon({
          // html: `<svg version="1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 149 178"><path fill="`+geo.geopunto_color+`" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#FFF" cx="74" cy="75" r="24"/></svg>`,
          html: this.geopointsService.geopointHTMLMarkerIcon(
            geo.geopunto_color
          ),
          className: '',
          iconSize: [24, 41.86],
          iconAnchor: [12, 41.86],
        });

        var popupText =
        '<span>Latitud: ' +
        this.mapService.map.getCenter().lat +
        '<br>Longitud: ' +
        this.mapService.map.getCenter().lng +
        '</span>'; 
 
        geo.geo_elemento = L.marker(
          [parseFloat(latlng[0]), parseFloat(latlng[1])],
          { icon: svgIcon }
        ).bindPopup("hola")
        console.log("puntomodificado",this.form.geopunto_vertices)

        if (geo.geopunto_visible == 'true') {
          geo.geo_elemento.addTo(this.mapService.map);
        }

        geo.marker_name = L.circleMarker(
          [parseFloat(latlng[0]), parseFloat(latlng[1])],
          {
            // pane: 'markers1',
            radius: 0,
            fillColor: '#000', //color,
            fillOpacity: 1,
            color: '#000', //color,
            weight: 1,
            opacity: 1,
          }
        ).bindTooltip(
          /* '<b class="" style="background-color: '+ this.mapService.hexToRGBA(geo.geopunto_color) +'; color: '+ this.mapService.getContrastYIQ(geo.geopunto_color) +';">'+geo.geopunto_name+'</b>', */
          '<b class="" style="background-color: ' +
            this.mapService.hexToRGBA(geo.geopunto_color) +
            ';">' +
            geo.geopunto_name +
            '</b>',
          {
            permanent: true,
            offset: [0, 20],
            direction: 'center',
            className: 'leaflet-tooltip-own geopoint-tooltip',
          }
        );

        if (geo.geopunto_nombre_visible == 'true') {
          geo.marker_name.addTo(this.mapService.map);
        }

        this.spinner.hide('spinnerLoading');
        this.geopointsService.updateGeoCounters();
        this.geopointsService.updateGeoTagCounters();
        this.geopointsService.eyeInputSwitch =
          this.geopointsService.geopointCounters.visible != 0;
        this.geopointsService.tagNamesEyeState =
          this.geopointsService.geopointTagCounters.visible != 0;
      });
    } else {
      // this.form.geo_geometry = this.layerToPoints(this.poligonAdd,'POLYGON');

      this.pointAdd.dragging.disable();

      this.form.geopunto_nombre_visible = this.form.geopunto_nombre_visible_bol
        ? 'true'
        : 'false';
      this.form.geopunto_visible = this.form.geopunto_visible_bol
        ? 'true'
        : 'false';

      this.form.geopunto_vertices = this.layerToPoints(this.pointAdd, 'POINT');

      this.geopointsService.store(this.form).then((res1) => {
        console.log('---clickGuardar NUEVO----');
        console.log(res1);

        this.geopointsService.nombreComponente = 'LISTAR';

        let gNew = res1[2];
        // let gNew2 = res1[3][0];
        // var geo = this.geofencesService.geofences.filter((item:any)=> item.id == gEdit.id)[0];

        var geo: any = {};
        geo.geopunto_id = gNew.id;
        geo.geopunto_color = gNew.color_punto;
        geo.geopunto_name = gNew.nombre_punto;
        geo.geopunto_nombre_visible = gNew.nombre_visible_punto;
        geo.geopunto_nombre_visible_bol =
          geo.geopunto_nombre_visible === 'true';

        geo.geopunto_visible = gNew.visible_punto;
        geo.geopunto_visible_bol = geo.geopunto_visible === 'true';

        geo.geopunto_vertices = gNew.coordenadas_punto;
        geo.user_id = gNew.usuario_id;

        this.mapService.map.removeLayer(this.pointAdd);

        // ==============2

        var latlng = geo.geopunto_vertices.split(',');

        const svgIcon = L.divIcon({
          // html: `<svg version="1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 149 178"><path fill="`+geo.geopunto_color+`" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#FFF" cx="74" cy="75" r="24"/></svg>`,
          html: this.geopointsService.geopointHTMLMarkerIcon(
            geo.geopunto_color
          ),
          className: '',
          iconSize: [24, 41.86],
          iconAnchor: [12, 41.86],
        });

        var popupText =
        '<span>Latitud: ' +
        this.mapService.map.getCenter().lat +
        '<br>Longitud: ' +
        this.mapService.map.getCenter().lng +
        '</span>';
        
        geo.geo_elemento = L.marker(
          [parseFloat(latlng[0]), parseFloat(latlng[1])],
          { icon: svgIcon }
        ).bindPopup(popupText, { offset: [0, -20] });
        
        //console.log ("AGREEGARGEOPUNTO",geo.geo_elemento)

        

        if (geo.geopunto_visible == 'true') {
          geo.geo_elemento.addTo(this.mapService.map);
        }

        geo.marker_name = L.circleMarker(
          [parseFloat(latlng[0]), parseFloat(latlng[1])],
          {
            // pane: 'markers1',
            radius: 0,
            fillColor: '#000', //color,
            fillOpacity: 1,
            color: '#000', //color,
            weight: 1,
            opacity: 1,
          }
        ).bindTooltip(
          /* '<b class="" style="background-color: '+ this.mapService.hexToRGBA(geo.geopunto_color) +'; color: '+ this.mapService.getContrastYIQ(geo.geopunto_color) +';">'+geo.geopunto_name+'</b>', */
          '<b class="" style="background-color: ' +
            this.mapService.hexToRGBA(geo.geopunto_color) +
            ';">' +
            geo.geopunto_name +
            '</b>',
          {
            permanent: true,
            offset: [0, 20],
            direction: 'center',
            className: 'leaflet-tooltip-own geopoint-tooltip',
          }
        );

        if (geo.geopunto_nombre_visible == 'true') {
          geo.marker_name.addTo(this.mapService.map);
        }

        // ===== 2

        this.geopointsService.geopoints.push(geo);

        this.spinner.hide('spinnerLoading');
        this.geopointsService.initializeTable();
        this.geopointsService.updateGeoCounters();
        this.geopointsService.updateGeoTagCounters();
        this.geopointsService.eyeInputSwitch =
          this.geopointsService.geopointCounters.visible != 0;
        this.geopointsService.tagNamesEyeState =
          this.geopointsService.geopointTagCounters.visible != 0;

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

  layerToPoints(figure: any, type: string) {
    var geoElement = '';

    switch (type) {
      case 'POINT':
        // var latlngs = figure.getLatLngs();
        // console.log(figure);
        // console.log(figure.getLatLng());

        // var latlng = figure.getLatLng();
        // console.log(figure.getLatLng().lat);
        // console.log(figure.getLatLng().lng);

        geoElement = figure.getLatLng().lat + ',' + figure.getLatLng().lng;

        break;
    }
    console.log(geoElement);

    return geoElement;
  }

  changeGeoColor(id: number) {
    let newColor = this.form.geopunto_color;

    console.log(newColor);

    if (this.geopointsService.action == 'edit') {
      var geo = this.geopointsService.geopoints.filter(
        (item: any) => item.geopunto_id == id
      )[0];

      // geo.geo_elemento.setStyle({opacity: 1, color: newColor });

      const svgIcon = L.divIcon({
        //html: `<svg version="1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 149 178"><path fill="`+newColor+`" stroke="#2BFF00" stroke-width="8" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#2BFF00" cx="74" cy="75" r="30"/></svg>`,
        html:
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 34.892"><g transform="matrix(1.18559 0 0 1.18559 -965.773 -331.784)"><path d="M817.112 282.971c-1.258 1.343-2.046 3.299-2.015 5.139.064 3.845 1.797 5.3 4.568 10.592.999 2.328 2.04 4.792 3.031 8.873.138.602.272 1.16.335 1.21.062.048.196-.513.334-1.115.99-4.081 2.033-6.543 3.031-8.871 2.771-5.292 4.504-6.748 4.568-10.592.031-1.84-.759-3.798-2.017-5.14-1.437-1.535-3.605-2.67-5.916-2.717-2.312-.048-4.481 1.087-5.919 2.621z" style="fill:` +
          newColor +
          `;"/><circle r="3.035" cy="288.253" cx="823.031" style="fill:#fff"/></g></svg>`,
        className: '',
        iconSize: [24, 41.86],
        iconAnchor: [12, 41.86],
      });

      geo.geo_elemento.setIcon(svgIcon);
    } else {
      // console.log("CREACION DE GEOCERCA");
      //this.poligonAdd.setStyle({opacity: 1, color: newColor });
      const svgIcon = L.divIcon({
        //html: `<svg version="1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 149 178"><path fill="`+newColor+`" stroke="#2BFF00" stroke-width="8" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#2BFF00" cx="74" cy="75" r="30"/></svg>`,
        html:
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 34.892"><g transform="matrix(1.18559 0 0 1.18559 -965.773 -331.784)"><path d="M817.112 282.971c-1.258 1.343-2.046 3.299-2.015 5.139.064 3.845 1.797 5.3 4.568 10.592.999 2.328 2.04 4.792 3.031 8.873.138.602.272 1.16.335 1.21.062.048.196-.513.334-1.115.99-4.081 2.033-6.543 3.031-8.871 2.771-5.292 4.504-6.748 4.568-10.592.031-1.84-.759-3.798-2.017-5.14-1.437-1.535-3.605-2.67-5.916-2.717-2.312-.048-4.481 1.087-5.919 2.621z" style="fill:` +
          newColor +
          `;"/><circle r="3.035" cy="288.253" cx="823.031" style="fill:#2BFF00"/></g></svg>`,
        className: '',
        iconSize: [24, 41.86],
        iconAnchor: [12, 41.86],
      });

      this.pointAdd.setIcon(svgIcon);
    }
  }
}


//add-geopoints.component