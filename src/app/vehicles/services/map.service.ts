import { Injectable, Output, EventEmitter } from '@angular/core';
import { Vehicle } from '../models/vehicle';
import RefData from '../data/refData';
import * as L from 'leaflet';

import { VehicleService } from './vehicle.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map!: L.Map;
  private dataFitBounds: [string, string][] = [];
  private marker: any = [];
  // private demo: any = [];

  @Output() sendData = new EventEmitter<any>();
  @Output() changeEye = new EventEmitter<any>();

  constructor(private vehicleService:VehicleService) {
    this.vehicleService.drawIconMap.subscribe(e=>{
      this.onDrawIcon(this.map);
    });
    this.vehicleService.dataCompleted.subscribe(vehicles=>{
      this.onDrawIcon(this.map);
    });
  }

  changeStatusEye(id: number): void {
    this.changeEye.emit(id);
  }

  sendDataMap(data: Vehicle[]): void{
    this.sendData.emit(data);
  }

  loadMap(map: any): void{
    this.map = map;
  }

  onDrawIcon(map: any): void{
    console.log("onDrawIcon");
    // this.map = map;

    const e = this.vehicleService.vehicles;

    for (const layer in this.marker){
      this.map.removeLayer(this.marker[layer]);
    }

    for (const property in e){
        if (e.hasOwnProperty(property)&&e[property].eye == true) {
          const aux2: [string, string] = [e[property].latitud, e[property].longitud];
          this.dataFitBounds.push(aux2);
          // this.map.removeLayer(this.demo);
          this.drawIcon(e[property].IMEI, map, Number(e[property].latitud), Number(e[property].longitud));
        }
    }

    if(this.dataFitBounds.length>0){
      map.fitBounds(this.dataFitBounds);
    }
    this.dataFitBounds = [];
  }

  private drawIcon(IMEI:string, map: any, lat: number, lng: number): void{
    const iconMarker = L.icon({
      iconUrl: './assets/images/batgps.png',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    const tempMarker = L.marker([lat, lng], {icon: iconMarker}).addTo(map);
    this.marker[IMEI]=tempMarker;

  }
}
