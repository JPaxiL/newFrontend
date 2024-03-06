import { Injectable } from '@angular/core';
import { IMapMinimap, MapItemConfiguration } from 'src/app/multiview/models/interfaces';
import { MiniMap } from 'src/app/multiview/models/mini-map';
import { MiniMapGeofences } from '../models/mini-map-geofences';
import { MinimapComponent } from 'src/app/multiview/minimap/minimap.component';
import { DataGeofence } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GeofenceImportExportService {
  minimap!: MiniMapGeofences;


  constructor() { }

  startMiniMap(config:MapItemConfiguration,datos:DataGeofence[]){
    this.minimap= new MiniMapGeofences(config);
    this.minimap.createMap();
    console.log("startminimap",datos); 
    this.minimap.setLayers(datos);
  };
  coordinateGeofence(datos:DataGeofence[]){
    this.minimap.coordenadasGeo(datos);
  }

}
