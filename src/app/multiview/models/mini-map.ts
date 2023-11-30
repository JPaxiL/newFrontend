import { IMapMinimap, MinimapContent } from "./interfaces";
import { MapBase } from "src/app/map/models/map-base";

export class MiniMap extends MapBase implements IMapMinimap {

    imeiPopup?: any;
    time_stop?: any;
    minimapConf: MinimapContent
    
    public constructor( minimapConf: MinimapContent){
        super(minimapConf.mapConf!.containerId);
        this.minimapConf = minimapConf;
        this.minimapConf.mapConf!.dataFitBounds = this.getDataFitBounds(this.minimapConf.vehicles!);
    }

    public createMap(): void {
        if(this.minimapConf!.mapConf){
            super.createMap(
                this.minimapConf!.mapConf.dataFitBounds!,
                this.minimapConf!.mapConf.zoom,
                this.minimapConf!.mapConf.maxZoom,
                this.minimapConf!.mapConf.editable
            )
        }else{
            console.error("Configuración de mapa no permitida");
        }
    }

    
}
