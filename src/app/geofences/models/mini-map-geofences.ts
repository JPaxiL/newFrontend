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
  coordenadasGeo(datos: DataGeofence[]) {
    console.log("globalCoordenadas1:", datos);
    const globalCoordinates: number[][] = [];
    const globalCoordinatesGeo: number[][][] = [];

    for (const data of datos) {

      if (data) {
        //const coordinatesSets = data.coordinate!.split(' ');
        //console.log("globalCoordenadas2:", coordinatesSets);
        const coordinatesSets = data.coordinate!.trim().split(' ');

        // Filtrar los conjuntos de coordenadas que no son solo espacios
        const filteredCoordinates = coordinatesSets.filter(coordSet => coordSet.trim() !== '');
        console.log("globalCoordenadas2.1:", coordinatesSets);

        console.log("globalCoordenadas2.2:", filteredCoordinates);

        for (const coordSet of coordinatesSets) {
          const coordinatesArray = coordSet.split(',').map((coord: string) => parseFloat(coord));
          globalCoordinates.push(coordinatesArray);
        }
        globalCoordinatesGeo.push([...globalCoordinates]);
        globalCoordinates.length = 0;
      }
    }
    console.log("globalCoordenadas3:", globalCoordinatesGeo);

    for (let polygonCoordinates= 0;polygonCoordinates < globalCoordinatesGeo.length;polygonCoordinates++) {
      console.log("polygonCoordinates", globalCoordinatesGeo[polygonCoordinates]); // Agregar este log para verificar los datos de cada polígono

      // Crear un objeto GeoJSON para el polígono actual
      const geofenceData: GeoJSON.Polygon = {
        "type": "Polygon",
        "coordinates": [globalCoordinatesGeo[polygonCoordinates]], // Envuelve las coordenadas del polígono actual en un arreglo
      };

      const r = parseInt(datos[polygonCoordinates].color!.substring(0, 2), 16);
      const g = parseInt(datos[polygonCoordinates].color!.substring(2, 4), 16);
      const b = parseInt(datos[polygonCoordinates].color!.substring(4, 6), 16);

      // Definir un estilo para el polígono
      const styleOptions: L.PathOptions = {
        fillColor: `rgb(${r},${g},${b})`, // Color de relleno del polígono
        fillOpacity: 0.5, // Opacidad del relleno
        color: `rgb(${r},${g},${b})`, // Color del borde del polígono
        weight: 2, // Grosor del borde
      };

      

      // Agregar el polígono al mapa con el estilo definido
      L.geoJSON(geofenceData, {
        style: styleOptions, // Estilo del polígono
      }).bindTooltip(feature => datos[polygonCoordinates].description!).addTo(this.map!);
    }
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

