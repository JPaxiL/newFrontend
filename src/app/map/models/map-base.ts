import * as L from 'leaflet';
import { IMapBase, UserTracker } from 'src/app/multiview/models/interfaces';

export abstract class MapBase implements IMapBase {
    private _containerId: string;
    map?: L.Map | null; 
    markerClusterGroup?: any;
    markerClusterData?: any;
    markerClusterGroupOnda?: any;
    
    constructor(containerId:string){
        this._containerId = containerId;
    }

    public createMap(dataFitBounds:[number,number][], zoom?:number,maxZoom?:number,editable?:boolean){
        this.map = L.map(this._containerId, {
            preferCanvas:true,
            renderer: L.canvas(),
            center: this.getCenterMap(dataFitBounds),
            zoom: zoom??7,
            maxZoom: maxZoom??18,
            editable: editable??false
        }),
        this.markerClusterGroup = L.markerClusterGroup({
            removeOutsideVisibleBounds: true,
            zoomToBoundsOnClick: false
        }),
        this.markerClusterGroupOnda = L.markerClusterGroup({
            removeOutsideVisibleBounds: true,
            zoomToBoundsOnClick: false,
          });
        this.setFitBounds(dataFitBounds);
    };

    public setFitBounds(dataFitBounds: [number, number][]): void {
        this.map!.fitBounds(dataFitBounds);
    }

    private getCenterMap(dataFitBounds:[number, number][]): [number, number] {
        let lats: number[];
        let longs: number[];
        if (dataFitBounds.length === 0) {
            return [0,0];  // No se puede calcular el centro si no hay pares [lat,long]
        }
        // Calcula el promedio de latitudes y longitudes
        lats = dataFitBounds.map((pair:[number,number]) => pair[0]!);
        longs = dataFitBounds.map((pair:[number,number]) => pair[1]!);
      
        const avgLatitude = lats.reduce((a, b) => a + b) / lats.length;
        const avgLongitude = longs.reduce((a, b) => a + b) / longs.length;

        return [avgLatitude, avgLongitude]
    }

    public setViewMap(dataFitBounds:[number, number][],zoom?:number) {
        this.map?.setView(this.getCenterMap(dataFitBounds))
    }

    public getDataFitBounds(vehicles: UserTracker[]): [number, number][]{
        if (vehicles.length === 0) {
            return [[0,0]];  // No se puede calcular el centro si no hay vehículos
        }
        const auxDataFit: [number,number][] = []
        for (let vehicle of vehicles!){
                const aux2: [number, number] = [parseFloat(vehicle.latitud!), parseFloat(vehicle.longitud!)];
                auxDataFit.push(aux2);
        }
        
        return auxDataFit;
    }

    get containerId():string{
        return this._containerId;
    }
}
