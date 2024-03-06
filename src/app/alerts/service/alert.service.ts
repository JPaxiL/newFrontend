import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Alert } from '../models/alert.interface';
import { ResponseInterface } from 'src/app/core/interfaces/response-interface';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  isLoadingData: boolean = true;

  public alerts: Alert[] = [];
  public alertEdit: any;
  public alertsByType: any = [];
  public panelAlertKey: Number = 0;

  dataCompleted = false;

  public alertsForEventSocket: any[] = [];
//EXCESO DE VELOCIDAD FALTANTE

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
    // Nuevos sonidos
    { id: 10, ruta: 'sonidos/bloop.mp3', label: 'Sonido 10' },
    { id: 11, ruta: 'sonidos/error.mp3', label: 'Sonido 11' },
    { id: 12, ruta: 'sonidos/happypop1.mp3', label: 'Sonido 12' },
    { id: 13, ruta: 'sonidos/happypop2.mp3', label: 'Sonido 13' },
    { id: 14, ruta: 'sonidos/phonehanging.mp3', label: 'Sonido 14' },
    { id: 15, ruta: 'sonidos/notification.mp3', label: 'Sonido 15' },
    { id: 16, ruta: 'sonidos/ringtone.mp3', label: 'Sonido 16' },
    { id: 17, ruta: 'sonidos/shortsuccess.mp3', label: 'Sonido 17' },
    {
      id: 18,
      ruta: 'sonidos/notificationemail.mp3',
      label: 'Sonido 18',
    },

    { id: 19, ruta: 'sonidos/sound.mp3', label: 'Sonido 19' },
    { id: 20, ruta: 'sonidos/sound1.mp3', label: 'Sonido 20' },
    { id: 21, ruta: 'sonidos/ALARMA1.mp3', label: 'Sonido 22' },
    { id: 23, ruta: 'sonidos/ALARMA2.mp3', label: 'Sonido 23' },
    { id: 24, ruta: 'sonidos/ALARMA3.mp3', label: 'Sonido 24' },
    { id: 25, ruta: 'sonidos/ALARMA4.mp3', label: 'Sonido 25' },
    { id: 26, ruta: 'sonidos/digitalalarm.mp3', label: 'Sonido 26' },
    { id: 27, ruta: 'sonidos/watchalarm.mp3', label: 'Sonido 27' },

    // SONIDOS PERSONALIZADOS
    {
      id: 28, //X
      ruta: 'sonidos/aceleracion brusca.mp3',
      label: 'Voz Personalizada',
    },
    {
      id: 29, //X
      ruta: 'sonidos/anticolisión frontal.mp3',
      label: 'Voz Personalizada',
    },
    {
      id: 30, //X
      ruta: 'sonidos/desvio carril derecha.mp3',
      label: 'Voz Personalizada',
    },
    {
      id: 31, //X
      ruta: 'sonidos/desvio carril izquierda.mp3',
      label: 'Voz Personalizada',
    },
    {
      id: 32, //X
      ruta: 'sonidos/distracción.mp3',
      label: 'Voz Personalizada',
    },
    {
      id: 33, //X
      ruta: 'sonidos/exceso de velocidad.mp3',
      label: 'Voz Personalizada',
    },
    {
      id: 34, //X
      ruta: 'sonidos/fatiga extrema.mp3',
      label: 'Voz Personalizada',
    },
    {
      id: 35, //X
      ruta: 'sonidos/frenada brusca.mp3',
      label: 'Voz Personalizada',
    },
    {
      id: 36, //X
      ruta: 'sonidos/infracción.mp3',
      label: 'Voz Personalizada',
    },
    {
      id: 37, //x
      ruta: 'sonidos/no rostro.mp3',
      label: 'Voz Personalizada',
    },
    {
      id: 38, //X
      ruta: 'sonidos/posible fatiga.mp3',
      label: 'Voz Personalizada',
    },
    {
      id: 39, //X
      ruta: 'sonidos/riesgo de colisión con peatones.mp3',
      label: 'Voz Personalizada',
    }, 
    {
      id: 40, //X
      ruta: 'sonidos/exceso_velocidad.mp3',
      label: 'Voz Personalizada',
    },
  ];
  sonidosObtenidos: any;

  constructor(private http: HttpClient) {
    console.log('INICIANDO-----ALERTSERVICE');
  }

  public async get(id: string): Promise<Alert[]> {
    const response: ResponseInterface = await this.http
      .get<ResponseInterface>(`${environment.apiUrl}/api/alerts/${id}`)
      .toPromise();
    return response.data;
  }

  public async getAll(
    key: string = '',
    show_in_page: number = 15,
    page: number = 1
  ): Promise<Alert[]> {
    // console.log('Obteniendo Alertas...');
    const response: ResponseInterface = await this.http
      .get<ResponseInterface>(`${environment.apiUrl}/api/alerts`)
      .toPromise();
    let i = 1;
    let alerts_for_events_socket: any[] = [];
    this.alerts = response.data.map((data: Alert): Alert => {
      let sistema_notificacion = data?.sistema_notificacion?.split(',');
      data.sonido_sistema_bol = sistema_notificacion[2] == 'true';
      data.activo_bol = data.activo == 'true';
      data.notificacion_email_bol = data.notificacion_email == 'true';

      alerts_for_events_socket.push({
        evento_id: data.id,
        sonido_sistema_bol: data.sonido_sistema_bol,
        ruta_sonido: sistema_notificacion[3],
      });

      data.nr = i;
      i++;

      return data;
    });
    this.alertsForEventSocket = alerts_for_events_socket;
    // console.log('Alertas obtenidas');
    //console.log(this.alertsForEventSocket);
    this.dataCompleted = true;
    return this.alerts;
  }

  public getDataAll() {
    return this.alerts;
  }

  public clearDataAll() {
    this.alerts = [];
  }

  public async getAllEvents() {
    const response: ResponseInterface = await this.http
      .get<ResponseInterface>(`${environment.apiUrl}/api/events`)
      .toPromise();
    let events = response.data;
    return events;
  }

  public async getEventsByType(type: string) {
    const response: ResponseInterface = await this.http
      .get<ResponseInterface>(`${environment.apiUrl}/api/events/${type}`)
      .toPromise();
    let event = response.data;

    // event = event.filter(function( obj:any ) {
    //   return obj.id !== 23;  // id=23	name=Somnolencia	slug=somnolencia	type=accessories		 ==> 7.	Quitar los eventos de Somnolencia
    // });

    event = event.map((ev: any) => {
      ev.name = this.toCamelCase(ev.name);
      return ev;
    });

    return event;
  }

  toCamelCase(str: any) {
    const palabras = str.split(' ');

    var palabraM = palabras
      .map((palabra: any) => {
        if (
          palabra == 'de' ||
          palabra == 'en' ||
          palabra == 'con' ||
          palabra == 'de' ||
          palabra == 'la'
        ) {
          return palabra;
        } else {
          return palabra[0].toUpperCase() + palabra.substring(1);
        }
      })
      .join(' ');
    return palabraM;
  }

  public async getAlertsByType(type: string) {
    const response: ResponseInterface = await this.http
      .get<ResponseInterface>(`${environment.apiUrl}/api/alerts/${type}`)
      .toPromise();
    this.alertsByType = response.data;

    response.data.forEach((alert: any) => {
      //Cada vez que se cargan las listas de alerta por tipo, aprovechar en actualizar el sonido de la alerta.
      let i = this.alertsForEventSocket.findIndex(
        (alert_for_socket) => alert_for_socket.evento_id == alert.id
      );
      if (i != -1) {
        let sistema_notificacion = alert?.sistema_notificacion?.split(',');
        this.alertsForEventSocket[i].sonido_sistema_bol =
          sistema_notificacion[2] == 'true';
        this.alertsForEventSocket[i].ruta_sonido = sistema_notificacion[3];
      } else {
        console.log(
          'Alerts For Events Socket could be empty, or the alert deleted: ',
          this.alertsForEventSocket
        );
      }
    });
    //console.log(this.alertsForEventSocket);
    //console.log(response.data);
    return this.alertsByType;
  }

  public getDataByType() {
    return this.alertsByType;
  }

  public clearDataByType() {
    this.alertsByType = [];
  }

  public async create(alert: any) {
    console.log('data enviada', alert);
    const response: ResponseInterface = await this.http
      .post<ResponseInterface>(`${environment.apiUrl}/api/alerts`, alert)
      .toPromise();
    console.log('response', response);
    return response.data;
  }

  public async delete(id: string) {
    const response: ResponseInterface = await this.http
      .delete<ResponseInterface>(`${environment.apiUrl}/api/alerts/${id}`)
      .toPromise();
    return response.data;
  }

  public async edit(alert: any) {
    const response: ResponseInterface = await this.http
      .put<ResponseInterface>(
        `${environment.apiUrl}/api/alerts/${alert.id}`,
        alert
      )
      .toPromise();
    return response.data;
  }

  public getDataAlerts() {
    return this.alerts;
  }

  public getAlertEditData() {
    return this.alertEdit;
  }

  /*   public getAlertById(id: string) {
    console.log('id->', id);
    //console.log("Alerts----", this.alerts);
    return this.alerts.find((alert) => alert.id == id.toString());
  } */

  public getAlertById(id: string): Alert | undefined {
    console.log('id->', id);
    return this.alerts.find((alert) => alert.id.toString() === id);
  }

  //INICIO PRUEBA

  public getSoundAll() {
    return this.listaSonidos;
  }
  

  //FIN TEST
}
