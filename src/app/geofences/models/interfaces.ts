export interface IGeofence {
    id: string,
    idgrupo: string,
    idoperation: number,
    namegrupo: string,
    nameoperation: string,
    user_id?: string,
    orden: string,
    tags?: number[],
    tag_name_color: string,
    geo_coordenadas: string,
    tiempo_act_zone?: string,
    tiempo_zona?: string,
    vel2_zona?: string,
    vel3_zona?: string,
    vel_zone?: string,
    vel_max?: string,
    zone_cat?: string,
    zone_color: string,
    zone_name: string,
    zone_name_visible: string,
    zone_name_visible_bol: boolean,
    zone_vertices?: string,
    zone_visible: string,
    type?: string,
    eye?: boolean,
}

export interface IGeofences {
    geofences: IGeofence[],
    createTreeNode(data: IGeofence[]): Promise <any[]>,
}

export interface ITag{
    id: string,
    var_name: string,
}

export interface IOperation{
    idoperation: string,
    nameoperation: string,
    idgrupo: string,
    namegrupo: string,
} 
