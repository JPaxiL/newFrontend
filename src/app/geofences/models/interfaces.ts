export interface IGeofence {
    id: string,
    name: string,
    //items: Example[],
}

export interface IGeofences {
    geofences: IGeofence[],
    createTreeNode(data: IGeofence[]): any[],
}
