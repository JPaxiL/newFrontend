import { Injectable, Output, EventEmitter } from '@angular/core';
import { Vehicle } from '../models/vehicle';
import RefData from '../data/refData';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  @Output() sendData = new EventEmitter<any>();

  constructor() { }

  sendDataMap(data: Vehicle[]): any{
    this.sendData.emit(data);
  }

  onDrawIcon(map: any): void{
    const data: [string, string][] = [];
    const e = RefData.data;
    // console.log(e[0].IMEI);
    for (const property in e){
        if (e.hasOwnProperty(property)) {
          const aux2: [string, string] = [e[property].latitud, e[property].longitud];
          data.push(aux2);
          this.drawIcon(map, Number(e[property].latitud), Number(e[property].longitud));
        }
    }
    map.fitBounds(data);

  }
  private drawIcon(map: any, lat: number, lng: number): void{
    const iconMarker = L.icon({
      iconUrl: './marker-icon.png',
      iconSize: [30, 50],
      iconAnchor: [15, 50]
    });
    L.marker([lat, lng], {icon: iconMarker}).addTo(map);
  }
}
