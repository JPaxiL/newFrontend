import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { VehicleService } from 'src/app/vehicles/services/vehicle.service';
import { ToolbarMapService } from './toolbar-map.service';


@Injectable({
  providedIn: 'root',
})
export class MapServicesService {
  map!: L.Map; //guardara el mapa
  nombreMap: string = '001';
  display: boolean = false;
  showSearch: boolean = false;
  constructor(
    public toolbarMapService: ToolbarMapService
    ) {}

  setLayers(geofences:any, points:any, circular_geofences:any) {
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

 
    /* var geoPoints =  L.layerGroup(points.map( (point:any) => { return point.geo_elemento})); */

    const geoPoints = L.layerGroup(
      points.map((point: any) => {
      return L.layerGroup([
        point.geo_elemento,
        point.marker_name
      ]);
    })
  );

    /* console.log("321GEO",geoPoints) */
      

    var circular_geos = L.layerGroup(circular_geofences.map( (circular_geo:any) => { return circular_geo.geo_elemento}));

    const overlays = {
      "Geocercas poligonales": geos,
      "Geopuntos": geoPoints,
      "Geocercas circulares": circular_geos,
      // " Geocercas circulares":
    }

    L.control.layers(baseLayers,overlays).addTo(this.map);
    this.map.zoomControl.setPosition('topright');

    this.map.addControl(this.toolbarMapService.createToolbar(this.map));

    this.toolbarMapService.change.subscribe(display => {
      this.display = display;
    });
    this.toolbarMapService.searchClick.subscribe(() => {
      this.showSearch = !this.showSearch;
    });
  }

  getContrastYIQ(hex: string){
    var r = parseInt(hex.slice(1,3),16);
    var g = parseInt(hex.slice(3,5),16);
    var b = parseInt(hex.slice(5,7),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? '#000' : '#fff';
  }

  hexToRGBA(hex: string, alpha?: number){
    if(typeof alpha === 'undefined'){
      alpha = 0.8;
    }
    var c: any;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',' + alpha.toString() + ')';
    }
    console.log('Hex Color inválido');
    return 'rgba(255,255,255,0.9)';
  }

}
