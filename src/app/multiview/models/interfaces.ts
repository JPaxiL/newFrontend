import { SafeUrl } from "@angular/platform-browser";
import { Vehicle } from "src/app/vehicles/models/vehicle";

export interface Operation {
    id: number,
    descripcion?: string,
    nombre: string,
    usuario_id: number,
    enm_type?: string,
}
export interface Convoy {
    nombre: string,
    descripcion?: string,
    usuario_id: number,
    id: number,
    grupo_convoy_id?: number,
    operation_id?: number,
    bol_eliminado?: boolean,
    enm_type?: string,
}

export interface UnitItem {
    nombre: string,
    type: string, //"tracker", "convoy"
    imeis: string[],
    selected?: boolean,
    id?: number,
    operation?: string
}

export interface UserTracker {
    // timeLast?: boolean;
    driver_id?: string; //PARA LLAVE IBUTTON O ICIPIA
    nameconvoy?: string;
    namegrupo?: string;
    nameoperation?: string;
    id?: number,
    numero_placa?: string,
    nombre?: string,
    empresa?: string,
    nombre_grupo?: string,
    tracker_imei?: string,
    grupo_convoy_id?: string,
    icono?: string,
    selected?: boolean,
    latitud?: string,
    longitud?: string,
    speed?: number,
    dt_server?: string,
    dt_tracker?: string,
    altitud?: number,
    señal_gps?: number,
    señal_gsm?: number,
    parametros?: string,
    parametrosGet?: string[],
    eye?: boolean,
    tanque?: string,
    name?: string,
    name_old?: string,
    icon_def?: string,
    icon?:  string,
    icon_name?: string,
    icon_color?: string,
    limit_speed?: number,
    cant_gallons?: number
    // nameconvoy?: string,
    operation?: string,
    follow?: boolean,
    IMEI?: string,
    title?: string,
    show_events?: boolean,
    events?: number,
    zoom?: number,
    id_container?: string,
    vehicles?: UserTracker[],
    point_color?: string,
    active?:boolean,
    angulo?: string,
    bol_correctivo_fin?: boolean,
    bol_correctivo_ini?: boolean,
    dat_correctivo_fin?: string,
    dat_correctivo_ini?: string,
    grupo?: string,
    id_conductor?: number | null,
    idoperation?: number | null,
    idconvoy?: number | null,
    idgrupo?: number | null,
    iluminaria_h_i?: string,
    int_correctivo_h?: number,
    int_preventivo_h?: number,
    model?: string | null,
    namedriver?: string | null,
    plate_number?: string,
    sim_number?: string,
    tipo?: string,
    nametype_vehicle?: string | null
    tolva?: string,
    tag?: boolean,
    tag_driver?: boolean,
    cod_interno?: string | null,
    custom_url?: string;
    custom_svg?: any,
    relenti_svg?:any,
    movement_svg?:any,
    excess_svg?:any,
    movement_onda?:any | null,
}

export interface ScreenView {
    id?: number,
    name: string,
    is_open?: boolean,
    grids?: GridItem[],
    was_edited?: boolean,
}

export interface GridItem {
    structure?: StructureGrid,
    content?: UnitItem,
    content_type: string, // minimap or chart or add another in grid component
    label?: string,
    title?: string,
    show_only_label?: boolean,
}

export interface StructureGrid {
    row: number,
    col: number,
    span:number,
    structure_index?:number,
    gridItem_id: string,
}

export type MinimapContent = {
    title?: string,
    show_events?: boolean,
    nEvents?: number,
    events?: any[],
    imeis?: string[],
    vehicles?: UserTracker[],
    mapConf?: MapItemConfiguration
}

export interface IMapBase {
    containerId: string;
    map?: L.Map | null;
    markerClusterGroup?: any,
    markerClusterData?: any,
    createMap(dataFitBounds:[number,number][], zoom?:number, maxZoom?:number, editable?:boolean): void;
    setFitBounds(dataFitBounds:[number, number][]): void;
    setViewMap(dataFitBounds:[number, number][],zoom?:number): void;
    getDataFitBounds(vehicles: UserTracker[]): [number, number][];
}

export type MapItemConfiguration = {
    containerId: string,
    zoom?: number,
    maxZoom?: number,
    editable?: boolean,
    dataFitBounds?: [number, number][];
}
export interface IMapPopup extends IMapBase {
    popupConf: PopupContent,
    createMap(): void;
    drawIcon(data:Vehicle[],event: any): Promise<void>;
}

export type PopupContent = {
    id:string;
    vehicles?: Vehicle[],
    event?: any,
    mapConf?: MapItemConfiguration
}

export type PopupWrapper = {
    active:boolean;
    content?: PopupContent;
}

export interface IMapMinimap extends IMapBase {
    minimapConf: MinimapContent
    imeiPopup?: any;
    time_stop?: any;
    createMap(): void;
}

export interface Event {
    id: string,
    evento: string,
    nombre: string,
    clase: string,
    viewed: boolean,
    nombre_objeto: string,
    fecha_tracker: string,
}

export interface TableRowSelectEvent {
    originalEvent?: Event;
    data?: any;
    type?: string;
    index?: number;
}

export interface MediaRequest {
    device_id: string,
    from?: string, //date in UTC0 "2023-10-09 19:12:00"
    seconds: number, // max = 30
    source: string, //  CABIN | ROAD
}

export interface MultimediaItem {
    type: TypeCipiaMultimedia,
    params?: CipiaMultimediaParam,
    url: SafeUrl,
    blobId?: string, //id in indexedDB
    description?: string,
    title?: string,
    interval?: IntervalTime
}

export interface CipiaMultimediaParam {
    imei:string,
    eventId?:string,
    type:TypeCipiaMultimedia,
    from?: string, //date in UTC0 "2023-10-09 19:12:00"
    seconds?: number, // max= 30
    source: SourceCipiaMultimedia
}

export type IntervalTime = {
    start: string,
    end?: string,
    type?: IntervalType,
}
export type VideoOnDemandTime = 'demand' | 'now';
export type SourceCipiaMultimedia = "CABIN" | "ROAD";
export type TypeCipiaMultimedia = "video" | "image";
export type IntervalType = "recording" | "event" | "retrieve";
