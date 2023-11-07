
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
    eye?: boolean,
    tanque?: string,
    name?: string,
    icon?:  string,
    convoy?: string,
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
    nombre_conductor?: string | null,
    plate_number?: string,
    sim_number?: string,
    tipo?: string,
    nametype_vehicle?: string | null
    tolva?: string,
    tag?: boolean,
}

export interface ScreenView {
    id?: number,
    name: string,
    is_open?: boolean,
    grids?: GridItem[],
    was_edited?: boolean,
}

export interface GridItem {
    structure: StructureGrid,
    content?: UnitItem,
    content_type: string, // minimap or chart or add another in grid component
    label?: string,
    title?: string,
    show_only_label: boolean,
}
export interface StructureGrid {
    row: number,
    col: number,
    span:number,
    structure_index?:number,
    gridItem_id: string,
}

export interface MinimapContent {
    title?: string,
    show_events?: boolean,
    nEvents?: number,
    events?: any[],
    zoom?: number,
    id_container: string,
    imeis?: string[],
    vehicles?: UserTracker[],
}

export interface MapItem {
    id: string;
    map?: L.Map | null;
    markerClusterGroup?: any,
    markerClusterData?: any,
    imeiPopup?: any,
    time_stop?: any,
    configuration?: MinimapContent,
    dataFitBounds?: [number, number][],
    createMap(containerId: string, configuration: MinimapContent): void;
    setFitBounds(configuration: MinimapContent): [number, number][];
    setCenterMap(configuration: MinimapContent): [number, number];
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
