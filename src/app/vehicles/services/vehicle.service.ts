import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../models/vehicle';

import RefData from '../data/refData';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private URL_LIST = 'http://127.0.0.1:8000/api/tracker';
  public vehicles: any = [];
  @Output() drawIconMap = new EventEmitter<any>();

  constructor(private http: HttpClient) {
    this.vehicles = RefData.data;
  }

  public getVehicles(): Observable<any>{
    return this.http.get(this.URL_LIST);
  }
  public getVehiclesDemo(): any{
    return this.vehicles;
  }

  public getSession(): Observable <any>{
    return this.http.get(this.URL_LIST);
  }

  //app
  updateVehicleActive(data: Vehicle): void{
    this.vehicles = data;
    this.drawIconMap.emit(data);    
  }

}
