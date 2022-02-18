import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

import { MapService } from '../../../vehicles/services/map.service';
import { MapServicesService } from '../../services/map-services.service';
import { GeofencesService } from '../../../geofences/services/geofences.service';

declare var $: any;



@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})

export class MapViewComponent implements OnInit, AfterViewInit {

  //private map!: L.Map;

  constructor(
    private mapService: MapService,
    public mapServicesService: MapServicesService,
    public geofencesService: GeofencesService

    ) { }
  // constructor() { }

  ngOnInit(): void {


  }

  ngAfterViewInit(): void {
    this.createMap();
    //$("#panelMonitoreo").hide( "slow" )
    this.geofencesService.initialize();

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


  createMap() {

    const parcThabor = {
      lat: -11.107323,
      lng: -75.523437
    };

    const zoomLevel = 7;

    this.mapServicesService.map = L.map('map', {
      center: [parcThabor.lat, parcThabor.lng],
      zoom: zoomLevel
    });

    // this.map = L.map('map', {
    //   center: [parcThabor.lat, parcThabor.lng],
    //   zoom: zoomLevel
    // });

    const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 4,
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    mainLayer.addTo(this.mapServicesService.map);

    // if(mainLayer.addTo(this.map)){
      this.mapService.loadMap(this.mapServicesService.map);
    // }

  }

}
