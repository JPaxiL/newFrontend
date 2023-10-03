import { MapItem, MinimapContent, UserTracker } from "./interfaces";
import * as L from 'leaflet';

export class Map implements MapItem {
    id: string;
    map?: L.Map | null; 
    markerClusterGroup?: any;
    markerClusterData?: any;
    configuration?: MinimapContent;
    imeiPopup?: any;
    time_stop?: any;
    dataFitBounds?: [number, number][] = [];
    
    constructor(id:string){
        this.id = id;
    }

    createMap(containerId: string, configuration: MinimapContent){
        this.configuration = configuration;
        this.map = L.map(containerId, {
            center: this.setCenterMap(configuration),
            zoom: configuration.zoom??7,
            maxZoom: 18,
            editable: false
        }),
        this.markerClusterGroup = L.markerClusterGroup({
            removeOutsideVisibleBounds: true,
            zoomToBoundsOnClick: false
        }),
        this.dataFitBounds = this.setFitBounds(configuration),
        this.imeiPopup = "ninguno"
    };

    public setFitBounds(configuration: MinimapContent): [number, number][] {
        if (configuration.vehicles!.length === 0) {
            return [[0,0]];  // No se puede calcular el centro si no hay vehículos
        }
        const auxDataFit: [number,number][] = []
        for (let vehicle of configuration.vehicles!){
                const aux2: [number, number] = [parseFloat(vehicle.latitud!), parseFloat(vehicle.longitud!)];
                auxDataFit.push(aux2);
        }
        console.log("setFindBounds: ",auxDataFit);
        
        return auxDataFit;
    }

    public setCenterMap(configuration: MinimapContent): [number, number] {
        if (configuration.vehicles!.length === 0) {
            return [0,0];  // No se puede calcular el centro si no hay vehículos
        }
      
        // Calcula el promedio de latitudes y longitudes
        const latitudes = configuration.vehicles!.map(vehicle => parseFloat(vehicle.latitud!));
        const longitudes = configuration.vehicles!.map(vehicle => parseFloat(vehicle.longitud!));
    
        const avgLatitude = latitudes.reduce((a, b) => a + b) / latitudes.length;
        const avgLongitude = longitudes.reduce((a, b) => a + b) / longitudes.length;
    
        // Asigna el centro calculado
        console.log("setCenterMap: ",[avgLatitude, avgLongitude]);
        return [avgLatitude, avgLongitude]
    }

}
