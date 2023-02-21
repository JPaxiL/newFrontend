import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-editable';
import 'leaflet-path-drag';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

import { MapService } from '../../../vehicles/services/map.service';
import { MapServicesService } from '../../services/map-services.service';
import { GeofencesService } from '../../../geofences/services/geofences.service';
import { GeopointsService } from '../../../geopoints/services/geopoints.service';
import { CircularGeofencesService } from 'src/app/geofences/services/circular-geofences.service';
import { PolylineGeogencesService } from 'src/app/geofences/services/polyline-geogences.service';
import { HistorialService } from 'src/app/historial/services/historial.service';
import { isThisTypeNode } from 'typescript';


declare var $: any;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: [
    './map-view.component.scss'
  ],
})
export class MapViewComponent implements OnInit, AfterViewInit {
  //private map!: L.Map;

  constructor(
    private mapService: MapService,
    private circularGeofencesService: CircularGeofencesService,
    private polylineGeofenceService: PolylineGeogencesService,
    public mapServicesService: MapServicesService,
    public geofencesService: GeofencesService,
    public geopointsService: GeopointsService,
    public historialService: HistorialService

  ) {}
  // constructor() { }

  ngOnInit(): void {}

  async ngAfterViewInit() {
    this.createMap();
    //$("#panelMonitoreo").hide( "slow" )
    await this.geofencesService.initialize();
    await this.geopointsService.initialize();
    this.circularGeofencesService.initialize();
    this.polylineGeofenceService.initialize();

    this.setLayers();

    //=============Agregar Buscador de direccion.====================
    // const searchControl = GeoSearchControl({
    //   provider: new OpenStreetMapProvider(),

    //   showMarker: true, // optional: true|false  - default true
    //   showPopup: false, // optional: true|false  - default false
    //   marker: {
    //     // optional: L.Marker    - default L.Icon.Default
    //     // icon: new L.Icon.Default(),
    //     icon: L.icon({
    //         iconUrl: 'assets/images/route_end.png',
    //         iconAnchor: [16, 32]
    //     }),
    //     draggable: false,
    //   },
    //   // popupFormat: ({ query, result }) => result.label, // optional: function    - default returns result label,
    //   // resultFormat: ({ result }) => result.label, // optional: function    - default returns result label
    //   maxMarkers: 1, // optional: number      - default 1
    //   retainZoomLevel: false, // optional: true|false  - default false
    //   animateZoom: true, // optional: true|false  - default true
    //   autoClose: false, // optional: true|false  - default false
    //   searchLabel: 'Ingrese dirección', // optional: string      - default 'Enter address'
    //   keepResult: false, // optional: true|false  - default false
    //   updateMap: true, // optional: true|false  - default true
    // });

    // this.mapServicesService.map.addControl(searchControl);
    //=============Agregar Buscador de direccion.====================
  }

  async createMap() {
    console.log("CREATE MAPPPPPPPPPP");
    
    const parcThabor = {
      lat: -11.107323,
      lng: -75.523437,
    };

    const zoomLevel = 7;

    this.mapServicesService.map = L.map('map', {
      center: [parcThabor.lat, parcThabor.lng],
      zoom: zoomLevel,
      maxZoom: 18,
      editable: true
    });

    // if(mainLayer.addTo(this.map)){
    this.mapService.loadMap(this.mapServicesService.map);
    // }

    //this.mapServicesService.map.on('zoomstart zoom zoomend moveend', (ev) => {
    this.mapServicesService.map.on('moveend', (ev) => {

      // gauge.innerHTML = `Zoom level: ${map.getZoom()}`;
      // console.log("--------------------------------------");
      
      // console.log(this.mapServicesService.map.getZoom());
      // console.log(this.historialService.arrayRecorridos);


      //========================================================
      // console.log(this.mapService.map.getZoom());
      console.log(this.mapService.map.getZoom(), ev);

      var lvlzoom = this.mapService.map.getZoom();
      var nivel = 1000; // todo
      var ccont = 0;
      switch (lvlzoom) {
        case 12:
          nivel = 1000; //todo
          console.log("-------12 - 1000");
          break;
        case 13:
          nivel = 600; //todo
          console.log("-------13 - 600");
          break;
        case 14:
          nivel = 400; //todo
          console.log("-------14 - 400");
          break;
        case 15:
          nivel = 300; //todo
          console.log("-------15 - 200");
          break;
        case 16:
          nivel = 200; //todo
          console.log("-------16 - 100");
          break;
        case 17:
          nivel = 100; //todo
          console.log("-------17 - 50");
          break;
        case 18:
          nivel = 1; //todo
          console.log("-------18 - 1");
          break;
        default:
          nivel = 1000; // todo
          console.log("-------default");
          break;
      }
  

      var acum1 = 0.000000;
      var acum2 = nivel;

      var chckTrama = this.historialService.dataFormulario.chckTrama;
      var chckTramaFechaVelocidad = this.historialService.dataFormulario.chckTramaFechaVelocidad;

      
      console.log('check trama = '+chckTrama);
      
      var allH = this.historialService.arrayRecorridos;
      for (let j = 0; j < allH.length; j++) {
        var dH       = allH[j].recorrido;
        var mostrarR = allH[j].mostrarRuta;

        for (let i = 0; i < dH.length; i++) {
          this.mapService.map.removeLayer(dH[i]._trama);
          this.mapService.map.removeLayer(dH[i]._trama_fecha_velocidad);

        }

        if (lvlzoom >= 12) {
            if (chckTrama && mostrarR) {
              for (let i = 0; i < dH.length; i++) {
                if (isNaN(parseFloat(dH[i].distancia))) {
                  // console.log("----------DAA---------");
                } else {
                  acum1 = acum1 + parseFloat(dH[i].distancia);
                  // console.log(acum1 +"  -  "+acum2+"  -  "+parseFloat(dH[i].distancia));
                }
                dH[i]._trama.addTo(this.mapService.map);
                if ( acum1 > acum2 ) {
                  acum1 = 0;
                  // console.log(acum1 +"  -  "+ acum2);
                  if ( chckTramaFechaVelocidad  ) {
                    if(this.mapService.map.getBounds().contains(dH[i]._trama.getLatLng())){
                      dH[i]._trama_fecha_velocidad.addTo(this.mapService.map);
                    } 
                  }
                }
              }
            } 
        }

      }

    });

  }

  setLayers() {
    this.mapServicesService.setLayers(
      this.geofencesService.getData(),
      this.geopointsService.getData(),
      this.circularGeofencesService.getData()
    );
  }

  showCoordinate() {
    var lat = Number($('#dialog_show_point_lat').val());
    var lng = Number($('#dialog_show_point_lng').val());

    if (isNaN(lat)) {
      lat = 0;
    }
    if (isNaN(lng)) {
      lng = 0;
    }

    var marker = L.marker([0, 0], {
      icon: L.icon({
        iconUrl: '/assets/images/mm_20_red.png',
        iconAnchor: [6, 20],
      }),
    })
      .setLatLng([lat, lng])
      .addTo(this.mapServicesService.map);

    var tbl =
      '<table style="font-size:11px"><tr><td width="57">Direcci&#243n</td><td id="IDaleatorioH2">: ...</td></tr><tr><td>P.Cercano</td><td>: </td></tr><tr><td>Posici&#243n:</td><td><a href="https://maps.google.com/maps?q=' +
      lat +
      ',' +
      lng +
      '&t=m" target="_blank">' +
      Number(lat).toFixed(6) +
      '&#160;&#176;,&#160;' +
      Number(lng).toFixed(6) +
      '&#160;&#176;</a></td></tr></table>';

    var popup = L.popup({ offset: new L.Point(0, -10) })
      .setLatLng([lat, lng])
      .setContent(tbl)
      .addTo(this.mapServicesService.map);

    popup.on('remove', (e) => {
      this.mapServicesService.map.removeLayer(marker);
    });
    this.mapServicesService.map.panTo([lat, lng]);
    this.hideCoordinate();
  }

  hideCoordinate() {
    $('#dialog_show_point_lat').val('');
    $('#dialog_show_point_lng').val('');
    this.mapServicesService.display = false;
  }
}
