import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import * as L from 'leaflet';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root',
})
export class EventSocketService extends Socket {
  img_icon: string = '';
  img_iconSize: any;
  img_iconAnchor: any;
  count : number = 0;

  private sendEventSuject = new Subject<any>();
  public sendEventObservable = this.sendEventSuject.asObservable();

  constructor(public eventService : EventService) {
    super({
      url: '127.0.0.1:5000',
      // options: {
      //   transports: ["websocket"]
      // }
    });
  }

  public listen() {

    this.ioSocket.on('events', (event: any) => {
      this.count = this.count + 1;

      let even = JSON.parse(event);

      even.evento = even.descripcion_evento;
      even.tipo = even.descripcion_evento;
      even.fecha_tracker = moment(even.fecha_tracker).format("YYYY/MM/DD HH:mm:ss");
      even.fecha_minuto = moment(even.fecha_minuto).format("YYYY/MM/DD HH:mm:ss");
      even.fecha_servidor = moment(even.fecha_servidor).format("YYYY/MM/DD HH:mm:ss");
      even.imei = even.tracker_imei;

      let newEvent = this.setLayer(even);
      this.eventService.addNewEvent(newEvent);
    });
  }

  public getIcon() {
    // this.img_icon = 'assets/images/eventos/pin_point.svg';
    // this.img_iconSize = [30, 30];
    // this.img_iconAnchor = [0, 30];
  }

  setLayer(event:any){
    let icon = L.icon({
      iconUrl: 'assets/images/eventos/pin_point.svg',
      iconSize: [30,30], // size of the icon
      iconAnchor: [0,30], //[20, 40], // point of the icon which will correspond to marker's location
    });
    event.layer = L.marker([event.latitud, event.longitud], {
      icon: icon,
    }).bindPopup(event.evento);
    event.layer._myType = 'evento';
    event.layer._myId = event.id;
    return event;
  }

}
