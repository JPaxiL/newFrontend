export interface Operation {
    id: number,
    descripcion: string,
    nombre: string,
    usuario_id: number,
}


export interface UserTracker {
    id: number,
    numero_placa: string,
    nombre: string,
    empresa: string,
    tracker_imei: string,
    grupo_convoy_id: string,
    icono: string,
    id_conductor: string,
    selected: boolean,
    row: number,
    col:number,
    span: number,
    structure_index: number,
}

export interface ScreenView {
    id?: number,
    name: string,
    is_open?: boolean,
    grids?: GridItem[],
    was_edited?: boolean,
}

export interface GridItem {
    row: number,
    col: number,
    span:number,
    structure_index?:number,
    content?: any,
    content_type: string, // minimap or chart or add another in grid component
    label?: string,
    show_only_label: boolean,
}