import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

import { MapService } from '../../../vehicles/services/map.service';
import { MapServicesService } from '../../services/map-services.service';
import { GeofencesService } from '../../../geofences/services/geofences.service';
import { GeopointsService } from '../../../geopoints/services/geopoints.service';


declare var $: any;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit, AfterViewInit {
  //private map!: L.Map;

  constructor(
    private mapService: MapService,
    public mapServicesService: MapServicesService,
    public geofencesService: GeofencesService,
    public geopointsService: GeopointsService,

  ) {}
  // constructor() { }

  ngOnInit(): void {}

  async ngAfterViewInit() {
    this.createMap();
    //$("#panelMonitoreo").hide( "slow" )
    await this.geofencesService.initialize();
    await this.geopointsService.initialize();

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
    const parcThabor = {
      lat: -11.107323,
      lng: -75.523437,
    };

    const zoomLevel = 7;

    this.mapServicesService.map = L.map('map', {
      center: [parcThabor.lat, parcThabor.lng],
      zoom: zoomLevel,
      maxZoom: 18,
    });

    // if(mainLayer.addTo(this.map)){
    this.mapService.loadMap(this.mapServicesService.map);
    // }
  }

  setLayers(){
    this.mapServicesService.setLayers(this.geofencesService.getData(),this.geopointsService.getData());
  }
}
