import { Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Alert } from '../models/alert.interface';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private http: HttpClient) { }

  public async get(id:string):Promise <Alert[]> {
    const response: ResponseInterface = await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/alerts/${id}`).toPromise();
    return response.data;
  }

  public async getAll(key: string = '', show_in_page: number = 15, page: number = 1): Promise<Alert[]>{
    const response:ResponseInterface = await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/alerts`).toPromise();
    let i = 1;
    let alerts: Alert[] = response.data.map((data: Alert): Alert => {

      let sistema_notificacion = data?.sistema_notificacion?.split(",");
      data.sonido_sistema_bol = (sistema_notificacion[2] == 'true');
      data.activo_bol = (data.activo == 'true');
      data.notificacion_email_bol = (data.notificacion_email == 'true');

      data.nr = i;
      i++;

      return data;

    });

    return alerts;
  }

  public async getAllEvents() {
    const response:ResponseInterface = await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/events`).toPromise();
    let events = response.data;
    return events;
  }

  public async getEventsByType(type:string){
    const response:ResponseInterface = await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/events/${type}`).toPromise();
    let event = response.data;
    return event;
  }

  public async getAlertsByType(type:string){
    const response:ResponseInterface = await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/alerts/${type}`).toPromise();
    let event = response.data;
    return event;
  }
}
