import { Injectable } from '@angular/core';
import { IMapMinimap, MapItemConfiguration } from 'src/app/multiview/models/interfaces';
import { MiniMap } from 'src/app/multiview/models/mini-map';
import { MiniMapGeofences } from '../models/mini-map-geofences';
import { MinimapComponent } from 'src/app/multiview/minimap/minimap.component';
import { DataGeofence } from '../models/interfaces';
import * as L from 'leaflet';
@Injectable({
  providedIn: 'root'
})
export class GeofenceImportExportService {
  minimap!: MiniMapGeofences;
  constructor() { }
  startMiniMap(config: MapItemConfiguration) {
    console.log("startminimap", config);
    this.minimap = new MiniMapGeofences(config);
    this.minimap.createMap();
    this.minimap.setLayers();
  };
  addGeofences(coordinates: number[][][],datos: DataGeofence[]) {
    this.minimap.coordenadasGeo(coordinates,datos);
  };
  alignGeofence(coordinates: number[][][]){
    const bounds = this.calculateBounds(coordinates);
    console.log("alignGeofence",bounds[0]);
    this.minimap.setFitBounds(bounds);
  }

    // Función para calcular los límites de los polígonos
    private calculateBounds(polygons: number[][][]): [number,number][] {
      let minLat = Infinity;
      let minLng = Infinity;
      let maxLat = -Infinity;
      let maxLng = -Infinity;
  
      polygons.forEach(polygon => {
        polygon.forEach(coord => {
          minLat = Math.min(minLat, coord[0]);
          minLng = Math.min(minLng, coord[1]);
          maxLat = Math.max(maxLat, coord[0]);
          maxLng = Math.max(maxLng, coord[1]);
        });
      });
  
      return [[minLat, minLng], [maxLat, maxLng]];
    }
  coordinatesGeo(datos: DataGeofence []): number[][][] {
    console.log("globalCoordenadas1:", datos);
    const globalCoordinates: number[][] = [];
    const globalCoordinatesGeo: number[][][] = [];

    for (const data of datos) {

      if (data) {

        const coordinatesSets = data.coordinate!.trim().split(' ');

        for (const coordSet of coordinatesSets) {
          const coordinatesArray = coordSet.split(',').map((coord: string) => parseFloat(coord));

          globalCoordinates.push([coordinatesArray[0], coordinatesArray[1]]);
        }
        globalCoordinatesGeo.push([...globalCoordinates]);
        globalCoordinates.length = 0;
      }
    }
    return globalCoordinatesGeo;
  }

}
