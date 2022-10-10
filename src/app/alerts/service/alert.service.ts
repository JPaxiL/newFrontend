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

  public listaSonidos = [
    { id: 1, ruta: 'sonidos/alarm8.mp3', label: 'Sonido 1' },
    { id: 2, ruta: 'sonidos/alarm2.mp3', label: 'Sonido 2' },
    { id: 3, ruta: 'sonidos/CartoonBullets3.mp3', label: 'Sonido 3' },
    { id: 4, ruta: 'sonidos/DjStop4.mp3', label: 'Sonido 4' },
    { id: 5, ruta: 'sonidos/messenger5.mp3', label: 'Sonido 5' },
    { id: 6, ruta: 'sonidos/Ping6.mp3', label: 'Sonido 6' },
    { id: 7, ruta: 'sonidos/Twitter7.mp3', label: 'Sonido 7' },
    { id: 8, ruta: 'sonidos/Whatsap8.mp3', label: 'Sonido 8' },
    { id: 9, ruta: 'sonidos/WhatsappSound9.mp3', label: 'Sonido 9' },
    { id: 10, ruta: '', label: 'Sin Sonido' },
  ];

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
    console.log(this.alertsForEventSocket);
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

    response.data.forEach((alert: any) => {
      //Cada vez que se cargan las listas de alerta por tipo, aprovechar en actualizar el sonido de la alerta.
      let i = this.alertsForEventSocket.findIndex(alert_for_socket => alert_for_socket.evento_id == alert.id);
      if(i != -1){
        let sistema_notificacion = alert?.sistema_notificacion?.split(",");
        this.alertsForEventSocket[i].sonido_sistema_bol =(sistema_notificacion[2] == 'true');
        this.alertsForEventSocket[i].ruta_sonido = sistema_notificacion[3];
      } else {
        console.log('Alerts For Events Socket could be empty, or the alert deleted: ', this.alertsForEventSocket);
      }
    });
    console.log(this.alertsForEventSocket);
    //console.log(response.data);
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
