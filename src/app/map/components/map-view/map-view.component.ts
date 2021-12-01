import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

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

    this.geofencesService.initialize();

  }

  ngAfterViewInit(): void {
    this.createMap();
    //$("#panelMonitoreo").hide( "slow" )
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
