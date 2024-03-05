import { IMapMinimap, MapItemConfiguration, MinimapContent } from "src/app/multiview/models/interfaces";
import { MapBase } from "src/app/map/models/map-base";
import * as L from 'leaflet';
import { DataGeofence } from "./interfaces";
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

  setLayers(datos: DataGeofence[]) {

    console.log("setLayers", datos);
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
    console.log("geocercas4:", datos);
    this.coordenadasGeo(datos);
  };
  coordenadasGeo(datos: DataGeofence[]) {
    console.log("globalCoordenadas1:", datos);
    const globalCoordinates: number[][] = [];
    const globalCoordinatesGeo: number[][][] = [];

    for (const data of datos) {
      console.log("globalCoordenadas2:", data.coordinate);
      if (data) {
        const coordinatesSets = data.coordinate!.split(' ');

        for (const coordSet of coordinatesSets) {
          const coordinatesArray = coordSet.split(',').map((coord: string) => parseFloat(coord));
          globalCoordinates.push(coordinatesArray);
        }
        globalCoordinatesGeo.push([...globalCoordinates]);
        globalCoordinates.length = 0;
      }
    }
    console.log("globalCoordenadas3:", globalCoordinatesGeo);

    const flattenedCoordinates: [number, number][] = [];

    for (const coordinates of globalCoordinatesGeo) {
      // Itera sobre cada conjunto de coordenadas
      for (const coord of coordinates) {
        // Añade un par de coordenadas al arreglo
        flattenedCoordinates.push([coord[0], coord[1]]);
      }
    }

//    this.setFitBounds(flattenedCoordinates);
    const geofenceData: GeoJSON.Polygon = {
      "type": "Polygon",
      "coordinates": globalCoordinatesGeo,
    };
    L.geoJSON(geofenceData).addTo(this.map!);
  }

  public setFitBounds(dataFitBounds: [number, number][]): void {
    this.map!.fitBounds(dataFitBounds);
  }

  /*protected getCenterMap(dataFitBounds: [number, number][]): [number, number] {
    let lats: number[] = [];
    let longs: number[] = [];
    if (dataFitBounds.length === 0) {
      return [0, 0];  // No se puede calcular el centro si no hay pares [lat,long]
    }
    // Calcula el promedio de latitudes y longitudes
    lats = dataFitBounds.map((pair: [number, number]) => pair[0]!);
    longs = dataFitBounds.map((pair: [number, number]) => pair[1]!);

    const avgLatitude = lats.reduce((a, b) => a + b) / lats.length;
    const avgLongitude = longs.reduce((a, b) => a + b) / longs.length;

    return [avgLatitude, avgLongitude];
  }*/
}

