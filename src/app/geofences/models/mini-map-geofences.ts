import { IMapMinimap, MapItemConfiguration, MinimapContent } from "src/app/multiview/models/interfaces";
import { MapBase } from "src/app/map/models/map-base";
import * as L from 'leaflet';
export class MiniMapGeofences extends MapBase {

    imeiPopup?: any;
    time_stop?: any;
    minimapConf!: MapItemConfiguration;
    
    public constructor( minimapConf: MapItemConfiguration){
        super(minimapConf!.containerId);
        this.minimapConf = minimapConf;
    }
    public createMap(): void {
        if(this.minimapConf!){
            console.error("Configuracion iniciada");
            super.createMap(
                this.minimapConf!.dataFitBounds!,
                this.minimapConf!.zoom,
                this.minimapConf!.maxZoom,
                this.minimapConf!.editable
            )
        }else{
            console.error("Configuración de mapa no permitida");
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
    

        // Crear el control de capas
        L.control.layers(baseLayers).addTo(this.map!);
        
        this.map!.zoomControl.setPosition('topright');
    
        //this.mapItem.map!.addControl(this.minimapToolbar.createToolbar(this.mapItem.map!));
       /* this.addGeofencesToMap(circular_geofences);
        this.addGeofencesToMap(geofences);
        this.addGeofencesToMap(geopoints,false);*/
        //this.mapItem.map!.addLayer(this.mapLayers[0]);
        const limaCoordinates: number[][] = [
            [-77.2003, -12.2669], // Coordenadas del suroeste de Lima
            [-77.0086, -12.2669], // Coordenadas del sureste de Lima
            [-77.0086, -11.9282], // Coordenadas del noreste de Lima
            [-77.2003, -11.9282], // Coordenadas del noroeste de Lima
            [-77.2003, -12.2669]  // Coordenadas del suroeste de Lima (para cerrar el polígono)
          ];
          
          const geofenceData: GeoJSON.Polygon = {
            "type": "Polygon",
            "coordinates": [limaCoordinates],
          };
          
          L.geoJSON(geofenceData).addTo(this.map!);

    };
  }

