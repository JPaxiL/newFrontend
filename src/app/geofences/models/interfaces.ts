export interface IGeofence {
    id: string,
    idgrupo: string,
    idoperation: string,
    namegrupo: string,
    nameoperation: string,
    user_id?: string,
    orden: string,
    tag?: string,
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
    createTreeNode(data: IGeofence[]): any[],
}

export interface ITags{
    id: string,
    bol_eliminado?: boolean,
    var_name: string,
}
