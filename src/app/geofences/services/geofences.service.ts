import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeofencesService {
  public geofences:any = [];

  constructor(private http: HttpClient) {
    this.getAll();
  }

  public async getAll(key: string = '', show_in_page: number = 15, page: number = 1){
    await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/zone`).toPromise()
    .then(response => {
      this.geofences = response.data;
    });
  }

  public getData() {
    return this.geofences;
  }

}
