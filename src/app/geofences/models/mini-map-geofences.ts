import { IMapMinimap, MapItemConfiguration, MinimapContent } from "src/app/multiview/models/interfaces";
import { MapBase } from "src/app/map/models/map-base";
import { GeofenceImportExportService } from "../services/geofence-import-export.service";
import * as L from 'leaflet';
import { DataGeofence } from "./interfaces";
import { Geofences } from "./geofences";
export class MiniMapGeofences extends MapBase {

  imeiPopup?: any;
  time_stop?: any;
  minimapConf!: MapItemConfiguration;
  datos?: DataGeofence;
  public constructor(minimapConf: MapItemConfiguration) {
    super(minimapConf!.containerId);
    this.minimapConf = minimapConf;
  }
  public createMap(): void {
    if (!this.map) {
      super.createMap(
        this.minimapConf!.dataFitBounds!,
        this.minimapConf!.zoom,
        this.minimapConf!.maxZoom,
        this.minimapConf!.editable
      );
    } else {
      console.error("El mapa ya ha sido inicializado.");
    }
  }

  setLayers() {
    const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; GL Tracker',
      minZoom: 4,
      maxZoom: 18,
      crossOrigin: true
      // Otras opciones de configuración de la capa
    });

    mainLayer.addTo(this.map!);
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


    L.control.layers(baseLayers).addTo(this.map!);

    this.map!.zoomControl.setPosition('topright');
  };
  coordenadasGeo(coordinate: number[][][],datos: DataGeofence[]) {
    console.log("globalCoordenadas1111:", datos);
    let globalCoordinatesGeo: number[][][] = [];

    globalCoordinatesGeo=coordinate;

    console.log("coordenadasGeo", globalCoordinatesGeo)
    for (let polygonCoordinates = 0; polygonCoordinates < globalCoordinatesGeo.length; polygonCoordinates++) {
      const geofenceData: GeoJSON.Polygon = {
        "type": "Polygon",
        "coordinates": [globalCoordinatesGeo[polygonCoordinates]], // Envuelve las coordenadas del polígono actual en un arreglo
      };

      const r = parseInt(datos[polygonCoordinates].color!.substring(0, 2), 16);
      const g = parseInt(datos[polygonCoordinates].color!.substring(2, 4), 16);
      const b = parseInt(datos[polygonCoordinates].color!.substring(4, 6), 16);

      const styleOptions: L.PathOptions = {
        fillColor: `rgb(${r},${g},${b})`,
        fillOpacity: 0.5, 
        color: `rgb(${r},${g},${b})`, 
        weight: 2, 
      };

      L.geoJSON(geofenceData, {
        style: styleOptions,
      }).bindTooltip(feature => datos[polygonCoordinates].description!).addTo(this.map!);
    }
  }
}
