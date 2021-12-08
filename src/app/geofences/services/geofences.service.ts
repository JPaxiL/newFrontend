import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';

import { MapServicesService } from '../../map/services/map-services.service';

import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class GeofencesService {

  public geofences:any = [];
  public nombreComponente:string = "LISTAR";

  public idGeocercaEdit:number = 0;
  public action:string = "add"; //[add,edit,delete]


  constructor(
    private http: HttpClient,
    public mapService: MapServicesService,

    ) {
    //this.getAll();
  }

  //Se llama desde /app/map/components/map-view/map-view.component.ts
  public initialize() {
    this.getAll();
  }

  public async getAll(key: string = '', show_in_page: number = 15, page: number = 1){
    await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/zone`).toPromise()
    .then(response => {
      this.geofences = response.data;



      for (let i = 0; i < this.geofences.length; i++) {
        //const element = this.geofences[i];

        this.geofences[i].geo_elemento = new L.Polygon( this.getCoordenadas( JSON.parse(this.geofences[i].geo_coordenadas).coordinates[0] ), {
          weight: 3,
          fill: true,
          color: this.geofences[i].zone_color //'#000000'
        }).addTo(this.mapService.map);


        // this.geofences.geo_elemento.setLabel("NOMBRE");

      }

    });
  }

  public getData() {
    return this.geofences;
  }


  getCoordenadas(data:any){
    let coo = [];
    for (let i = 0; i < data.length; i++) {
      coo.push([data[i][1],data[i][0]]);
    };
    return coo;
  }

  //====================================

  public async edit(zone: any){
    const response:ResponseInterface = await this.http.put<ResponseInterface>(`${environment.apiUrl}/api/zone/${zone.id}`,zone).toPromise();
    return response.data;
  }

  public async store(zone: any){
    const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/zone`,zone).toPromise();
    return response.data;
  }

  public async delete(id: any){
    const response:ResponseInterface = await this.http.delete<ResponseInterface>(`${environment.apiUrl}/api/zone/${id}`).toPromise();
    return response.data;
  }

}
