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
  private demo:boolean = true;
  private timeDemo = 1000;
  public statusDataVehicle = false;

  @Output() dataCompleted = new EventEmitter<any>();

  @Output() drawIconMap = new EventEmitter<any>();

  constructor(private http: HttpClient) {
    /*
      procedimiento
        cargar data,
        emitir evento de carga a demas componentes
    */

    //tiempo critico
    if(this.demo){
      setTimeout(()=>{
        console.log("carga de data");
        this.vehicles = RefData.data;
        this.statusDataVehicle = true;
        this.dataCompleted.emit(this.vehicles);
      },this.timeDemo);
    }else{
      this.getVehicles().subscribe(vehicles=>{
        this.vehicles = vehicles;
        this.statusDataVehicle = true;
      });
    }

  }

  public getVehicles(): Observable<any>{
    return this.http.get(this.URL_LIST);
  }
  public getVehiclesDemo(): any{
    return this.vehicles;
  }
  public getVehiclesData(): any{
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
