import { MapItem, UserTracker } from "./interfaces";
import * as L from 'leaflet';

export class Map implements MapItem {
    id: string;
    map?: L.Map | null; 
    markerClusterGroup?: any;
    markerClusterData?: any;
    configuration?: UserTracker;
    vehicles?: any[];
    imeiPopup?: any;
    time_stop?: any;
    dataFitBounds?: [number, number][];
    
    constructor(id:string){
        this.id = id;
    }

    createMap(containerId: string, configuration: UserTracker){
        this.map = L.map(containerId, {
            center: [parseFloat(configuration.latitud!), parseFloat(configuration.longitud!)],
            zoom: configuration.zoom??7,
            maxZoom: 18,
            editable: false
        }),
        this.markerClusterGroup = L.markerClusterGroup({
            removeOutsideVisibleBounds: true,
            zoomToBoundsOnClick: false
        }),
        this.configuration = configuration,
        this.vehicles = [],
        this.dataFitBounds = [],
        this.imeiPopup = "ninguno"
    };
}
