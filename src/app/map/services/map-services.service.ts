import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapServicesService {
  map!: L.Map; //guardara el mapa
  nombreMap: string = '001';

  constructor() {}

  setLayers(geofences:any, points:any) {
    const mainLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        minZoom: 4,
        maxZoom: 18,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );

    mainLayer.addTo(this.map);
    // Google Map Layer

    const googleTerrain = L.tileLayer(
      'http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      {
        minZoom: 4,
        maxZoom: 18,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    );

    const googleHybrid = L.tileLayer(
      'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      {
        minZoom: 4,
        maxZoom: 18,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    );

    const googleStreets = L.tileLayer(
      'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      {
        minZoom: 4,
        maxZoom: 18,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    );

    // Satelite Layer
    const googleSat = L.tileLayer(
      'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      {
        minZoom: 4,
        maxZoom: 18,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    );

    var baseLayers = {
      OpenStreetMap: mainLayer,
      'Google Terrain': googleTerrain,
      'Google Hybrid': googleHybrid,
      'Google Streets': googleStreets,
      'Google Satellite': googleSat,
    };

    var geos = L.layerGroup(geofences.map( (geo:any) => { return geo.geo_elemento}));

    var geoPoints =  L.layerGroup(points.map( (point:any) => { return point.geo_elemento}));

    const overlays = {
      "Geocercas poligonales": geos,
      "Geopuntos": geoPoints,
      // " Geocercas circulares":
    }

    L.control.layers(baseLayers,overlays).addTo(this.map);
    this.map.zoomControl.setPosition('topright');
  }
}
