import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { combineLatest, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoActivityService {

  constructor(private httpClient: HttpClient) { }

  getDataVehicle(imei: string){

    let url = `${environment.apiUrl}/api/tracker/${imei}`;

    return this.httpClient.get(url);
  }


  getDataZone(id: string){
    
    let url = `${environment.apiUrl}/api/zone/${id}`;
    return this.httpClient.get(url);
  }

  getDataPoint(id: string){
    
    let url = `${environment.apiUrl}/api/point/${id}`;
    return this.httpClient.get(url);
  }
  getDataDriver(id: string){
    
    let url = `${environment.apiUrl}/api/driverData/${id}`;
    return this.httpClient.get(url);
  }
}
