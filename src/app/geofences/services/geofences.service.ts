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








      // geofence.geo_elemento = new L.Polygon(
      //   mapHelper.getCoors(figureType.POLYGON, JSON.parse(geofence.geo_coordenadas).coordinates),
      //   {
      //     weight: 3,
      //     fill: !geofence.bol_sin_relleno,
      //     color: geofence.zone_color,
      //     dashArray: mapHelper.parseLineType(geofence.enm_tipo_linea),
      //     layer: overlay
      //   }
      // );


      //dH[h].layerN = this.get_final_marker(dH[h]).addTo(this.mapService.map);


      // var geo1 = new L.Polygon(
      //     JSON.parse(this.geofences[0].geo_coordenadas).coordinates,
      //   {
      //     weight: 3,
      //     fill: true,
      //     color: '#FFFFFF'
      //     // dashArray: mapHelper.parseLineType(geofence.enm_tipo_linea),
      //   }
      // ).addTo(this.mapService.map);

      // console.log(this.geofences[0]);

      // console.log(JSON.parse(this.geofences[0].geo_coordenadas).coordinates);
      // console.log(JSON.parse(this.geofences[0].geo_coordenadas).coordinates[0]);



      for (let i = 0; i < this.geofences.length; i++) {
        //const element = this.geofences[i];

        this.geofences.geo_elemento = L.polygon( this.getCoordenadas( JSON.parse(this.geofences[i].geo_coordenadas).coordinates[0] ), {
          weight: 3,
          fill: true,
          color: this.geofences[i].zone_color //'#000000'
        }).addTo(this.mapService.map);

      }


      //var polygon = L.polygon( this.getCoordenadas( JSON.parse( this.geofences[0].geo_coordenadas).coordinates[0] ), {color: '#0f0', weight:5}).addTo(this.mapService.map);

      // var polygon2 = L.polygon([
      //       [51.512642, -0.099993],
      //       [51.520387, -0.087633],
      //       [51.509116, -0.082483]
      //   ]).addTo(this.mapService.map);




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


}
