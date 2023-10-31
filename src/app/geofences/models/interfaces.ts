export interface IGeofence {
    id: string,
    name: string,
    user_id: string,
    order: string,
    geo_coordenadas: string,
    zone_name?: string,
    grupo_convoy_id: string,
    geo_elemento: string, 
    //items: Example[],
}

export interface IGeofences {
    geofences: IGeofence[],
    createTreeNode(data: IGeofence[]): any[],
}
