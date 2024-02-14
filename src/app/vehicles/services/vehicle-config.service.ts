import { Injectable, Output, EventEmitter  } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';

@Injectable({
  providedIn: 'root'
})
export class VehicleConfigService {

  @Output() displayOn = new EventEmitter<any>();
  @Output() updateName = new EventEmitter<any>();

  constructor(private http: HttpClient) { }

  // private URL_LIST = 'http://127.0.0.1:8001/api/tracker';
  private api_url = environment.apiUrl;

  public getTest(){
    // //console.log("apiurl = ",this.api_url);
    return this.http.get(this.api_url+"/api/test");

  }
  public onVehicleUpdate(vehicle:any): void{
    this.updateName.emit(vehicle);
  }
  putConfig(vehicle: any): Observable<any>{
    return this.http.put(this.api_url+"/api/tracker/"+vehicle.IMEI,vehicle);
  }
  postGroup(req: any): Observable<any>{
    return this.http.post(this.api_url+"/api/group",req);
  }
  putGroupDelete(req: any): Observable<any>{
    return this.http.put(this.api_url+"/api/group_delete",req);
  }
  putGroupUpdate(req: any): Observable<any>{
    return this.http.put(this.api_url+"/api/group_update",req);
  }

  // updateUnitFixes(req: any): Observable<any>{
  //   return this.http.post(this.api_url+"/api/updateVehiclesFixes",req);
  // }
  // cleanUnitFixes(req: any): Observable<any>{
  //   return this.http.post(this.api_url+"/api/cleanVehiclesFixes",req);
  // }

  public async updateUnitFixes(subuser: any) {
    const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/updateVehiclesFixes`,subuser).toPromise();
    // console.log(response);
    return response;
  }

  public async cleanUnitFixes(subuser: any) {
    const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/cleanVehiclesFixes`,subuser).toPromise();
    // console.log(response);
    return response;
  }

}
