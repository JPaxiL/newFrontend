import { MapBase } from "src/app/map/models/map-base";
import { IMapPopup, PopupContent, UserTracker } from "src/app/multiview/models/interfaces";
import * as L from 'leaflet';
import { Vehicle } from "src/app/vehicles/models/vehicle";
import { MinimapService } from "src/app/multiview/services/minimap.service";

export class PopupMap extends MapBase implements IMapPopup{
    public markerClusterGroup!: L.MarkerClusterGroup;
    popupConf: PopupContent;

    public constructor( popupConf: PopupContent){
        super(popupConf.mapConf!.containerId);
        this.popupConf = popupConf;
        this.popupConf.mapConf!.dataFitBounds = this.getDataFitBounds(this.popupConf.vehicles! as UserTracker[]);
    }

    public createMap(): void {
        if(this.popupConf.mapConf){
            super.createMap(
                this.popupConf.mapConf!.dataFitBounds!,
                this.popupConf.mapConf!.zoom,
                this.popupConf.mapConf!.maxZoom,
                this.popupConf.mapConf!.editable
            )
        }else{
            console.error("Configuración no permitida");
        }
    }
    async drawIcon(vehicles: Vehicle[], event: any):Promise<void>{
        for (const vehicle of vehicles){
            let iconUrl = './assets/images/objects/nuevo/'+vehicle.icon;
        
            const iconMarker = L.icon({
              iconUrl: iconUrl,
              iconSize: [40, 40],
              iconAnchor: [25, 40],
              popupAnchor: [-3, -40]
            });
            console.log("iconMarker: ", iconMarker);

            // const popupText = '<div class="row"><div class="col-6" align="left"><strong>' + vehicle.name + '</strong></div><div class="col-6" align="right"><strong>' + vehicle.speed + ' km/h</strong></div></div>' +
            //                     '<aside #popupText class="">' +
            //                     '<small>CONVOY: ' + vehicle.convoy + '</small><br>' +
            //                     '<small>UBICACION: ' + vehicle.latitud + ', ' + vehicle.longitud + '</small><br>' +
            //                     '<small>REFERENCIA: ' + 'NN' + '</small><br>' +
            //                     '<small>FECHA DE TRANSMISION: ' + vehicle.dt_tracker + '</small><br>' +
            //                     '<small>TIEMPO DE PARADA: Calculando ...</small>' +
            //                     '</aside>';

            const tempMarker = L.marker([event.latitud, event.longitud], { icon: iconMarker });
            console.log("tempMarker: ", tempMarker);

            tempMarker.bindTooltip(`<span>${vehicle.name}</span>`, {
              permanent: true,
              offset: [0, 12],
              className: 'vehicle-tooltip'
            });

            this.markerClusterGroup.addLayer(tempMarker);
            this.markerClusterGroup.addTo(this.map!);
        }
    }

}
