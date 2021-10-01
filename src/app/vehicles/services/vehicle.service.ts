import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private URL_LIST = 'http://127.0.0.1:8000/api/tracker';

  constructor(private http: HttpClient) {}

  public getVehicles(): Observable<any>{
    return this.http.get(this.URL_LIST);
  }

  public getSession(): Observable <any>{

    // console.log("hola mundo service XD");
    return this.http.get(this.URL_LIST);
    // return true;
  }

}
