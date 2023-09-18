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
