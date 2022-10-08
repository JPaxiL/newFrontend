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

  isLoadingData:boolean = true;

  public alerts:Alert[] = [];
  public alertEdit:any;
  public alertsByType: any = [];
  public panelAlertKey: Number = 0;

  public alertsForEventSocket: any[] = [];

  constructor(private http: HttpClient) { }

  public async get(id:string):Promise <Alert[]> {
    const response: ResponseInterface = await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/alerts/${id}`).toPromise();
    return response.data;
  }

  public async getAll(key: string = '', show_in_page: number = 15, page: number = 1): Promise<Alert[]>{
    console.log('Obteniendo Alertas...');
    const response:ResponseInterface = await this.http.get<ResponseInterface>(`${environment.apiUrl}/api/alerts`).toPromise();
    let i = 1;
    let alerts_for_events_socket: any[] = [];
    this.alerts = response.data.map((data: Alert): Alert => {

      let sistema_notificacion = data?.sistema_notificacion?.split(",");
      data.sonido_sistema_bol = (sistema_notificacion[2] == 'true');
      data.activo_bol = (data.activo == 'true');
      data.notificacion_email_bol = (data.notificacion_email == 'true');

      alerts_for_events_socket.push(
        { evento_id: data.id, 
          sonido_sistema_bol: data.sonido_sistema_bol,
          ruta_sonido: sistema_notificacion[3]});

      data.nr = i;
      i++;

      return data;

    });
    this.alertsForEventSocket = alerts_for_events_socket;
    console.log('Alertas obtenidas');

    return this.alerts;
  }

  public getDataAll(){
    return this.alerts;
  }

  public clearDataAll(){
    this.alerts = [];
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
    this.alertsByType = response.data;
    return this.alertsByType;
  }

  public getDataByType(){
    return this.alertsByType;
  }

  public clearDataByType(){
    this.alertsByType = [];
  }

  public async create(alert: any) {
    const response:ResponseInterface = await this.http.post<ResponseInterface>(`${environment.apiUrl}/api/alerts`,alert).toPromise();
    return response.data;
  }

  public async delete(id:string){
    const response:ResponseInterface = await this.http.delete<ResponseInterface>(`${environment.apiUrl}/api/alerts/${id}`).toPromise();
    return response.data;
  }

  public async edit(alert: any){
    const response:ResponseInterface = await this.http.put<ResponseInterface>(`${environment.apiUrl}/api/alerts/${alert.id}`,alert).toPromise();
    return response.data;
  }

  public getDataAlerts(){
    return this.alerts;
  }

  public getAlertEditData(){
    return this.alertEdit;
  }
}
