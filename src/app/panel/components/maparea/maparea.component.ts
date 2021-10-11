import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

import { MapService } from '../../../vehicles/services/map.service';

declare var $: any;

@Component({
  selector: 'app-maparea',
  templateUrl: './maparea.component.html',
  styleUrls: ['./maparea.component.scss']
})
export class MapareaComponent implements OnInit, AfterViewInit {

  private map!: L.Map;

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.createMap();
    // this.mapService.drawIcon(this.map);
    $("#panelMonitoreo").hide( "slow" )
  }


  createMap() {

    const parcThabor = {
      lat: -11.107323,
      lng: -75.523437
    };

    const zoomLevel = 7;

    this.map = L.map('map', {
      center: [parcThabor.lat, parcThabor.lng],
      zoom: zoomLevel
    });


    const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 4,
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    if(mainLayer.addTo(this.map)){
      this.mapService.onDrawIcon(this.map);
    }

  }

}
