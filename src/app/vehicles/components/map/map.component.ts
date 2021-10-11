import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as L from 'leaflet';

import { MapService } from '../../services/map.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  private map!: L.Map;
  private centroid: L.LatLngExpression = [-11.107323, -75.523437];


  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.initMap();
    this.mapService.sendData.subscribe(e => {
      const data: [number, number][] = [];
      for (const property in e){
        if (e.hasOwnProperty(property)) {
          const aux2: [number, number] = [e[property].latitud, e[property].longitud];
          data.push(aux2);
          this.drawIcon(e[property].latitud, e[property].longitud);
        }
      }

      this.map.fitBounds(data);
    });
  }

  private drawIcon(lat: number, lng: number): void{

    const iconMarker = L.icon({
      iconUrl: './marker-icon.png',
      iconSize: [30, 50],
      iconAnchor: [15, 50]
    });
    L.marker([lat, lng], {icon: iconMarker}).addTo(this.map);
  }

  private initMap(): void {
      this.map = L.map('map', {
        center: this.centroid,
        zoom: 7
      });

      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 4,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });

      tiles.addTo(this.map);
      const iconMarker = L.icon({
        iconUrl: './marker-icon.png',
        iconSize: [30, 50],
        iconAnchor: [15, 50]
      });

      // let marker = L.marker([-11.107323,-75.523437],{icon:iconMarker}).addTo(this.map);

      this.map.doubleClickZoom.disable();

      // this.map.on('dblclick',(e)=>{
      //   console.log(Object.values(e)[3].lat);
      //   console.log(Object.values(e)[3].lng);
      //   L.marker([Object.values(e)[3].lat,Object.values(e)[3].lng],{icon:iconMarker}).addTo(this.map);
      //
      // });

  }

}
