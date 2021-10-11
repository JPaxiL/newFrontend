import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private URL_LIST = 'http://api_monitoreo_gltracker.test/api/tracker';

  constructor(private http: HttpClient) {}

  public getVehicles(): Observable<any>{
    return this.http.get(this.URL_LIST);
  }

  public getSession(): Observable <any>{
    return this.http.get(this.URL_LIST);
  }

}
