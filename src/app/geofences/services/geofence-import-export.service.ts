import { Injectable } from '@angular/core';
import { IMapMinimap, MapItemConfiguration } from 'src/app/multiview/models/interfaces';
import { MiniMap } from 'src/app/multiview/models/mini-map';
import { MiniMapGeofences } from '../models/mini-map-geofences';


@Injectable({
  providedIn: 'root'
})
export class GeofenceImportExportService {
  minimap!: MiniMapGeofences;

  constructor() { }

  startMiniMap(config:MapItemConfiguration){
    this.minimap= new MiniMapGeofences(config);
    this.minimap.createMap();
    this.minimap.setLayers();
  };
}
