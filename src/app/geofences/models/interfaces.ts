export interface IGeofence {
    id: string,
    user_id?: string,
    orden: string,
    geo_coordenadas: string,
    idgrupo: string,
    idoperation: string,
    namegrupo: string,
    nameoperation: string,
    zone_name?: string,
    //items: Example[],
}
export interface IGeofences {
    geofences: IGeofence[],
    createTreeNode(data: IGeofence[]): any[],
}
