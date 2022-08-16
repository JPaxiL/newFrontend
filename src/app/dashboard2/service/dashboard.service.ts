import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public vehicles:any = [];

  constructor( private http: HttpClient) { }

  public async getData(data:any){

    await this.http
    .post<ResponseInterface>(`${environment.apiUrl}/api/dashboard/get-data-vehicles`,data)
    .toPromise()
    .then( response => console.log("response =>>>>> ", response));
  }

  setVehicles(vehicles:any){
    this.vehicles = vehicles;
  }

  getVehicles(){
    return this.vehicles;
  }
}
